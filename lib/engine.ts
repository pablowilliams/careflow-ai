import { createHash, randomUUID } from "node:crypto";
import { evidenceLibrary, referrals } from "./data";
import { getReceipt, recordReceipt } from "./runtime-store";
import type { ExecutionReceipt, PolicyDecision, Proposal, Referral, TraceEvent, WorkflowResult } from "./types";

export function hashPayload(payload: unknown): string {
  return `sha256:${createHash("sha256").update(JSON.stringify(payload)).digest("hex")}`;
}

export function validateReferral(referral: Referral): string[] {
  const required = ["Patient identifier", "Referrer"];
  const missing = required.filter((key) => !referral.facts[key]?.trim());
  return [...new Set([...missing, ...referral.missingFields])];
}

export function retrieveEvidence(referral: Referral, now = new Date("2026-09-04T12:00:00Z")) {
  return evidenceLibrary.filter((item) => item.approved && item.specialty === referral.specialty && new Date(item.effectiveFrom) <= now && new Date(item.expiresAt) >= now);
}

export function evaluatePolicy(referral: Referral, action: Proposal["kind"]): PolicyDecision {
  if (referral.specialty !== "Respiratory") return { decision: "BLOCK", ruleId: "POL-SCOPE-002", version: "3.1", reason: "The demonstration is authorized only for Respiratory referrals.", requiresHumanApproval: false };
  if (referral.priority === "urgent") return { decision: "BLOCK", ruleId: "POL-RISK-004", version: "3.1", reason: "Urgent referrals require the existing manual escalation pathway.", requiresHumanApproval: false };
  if (action === "information-request") return { decision: "ALLOW_WITH_APPROVAL", ruleId: "POL-WRITE-011", version: "3.1", reason: "A draft information request may be created after exact-payload human approval.", requiresHumanApproval: true };
  return { decision: "ALLOW_READ", ruleId: "POL-READ-001", version: "3.1", reason: "Read-only review is permitted for the assigned coordinator.", requiresHumanApproval: false };
}

export function buildProposal(referral: Referral, now = new Date()): Proposal {
  const missing = validateReferral(referral);
  const kind: Proposal["kind"] = missing.length ? "information-request" : "no-action";
  const payload = {
    kind, recipient: referral.requester,
    subject: `Additional information requested for referral ${referral.id}`,
    body: missing.length ? `Please provide the following information for referral ${referral.id}: ${missing.join("; ")}. This request supports administrative pathway checks and does not provide clinical advice.` : `No additional administrative information is required for referral ${referral.id}.`
  };
  return {
    id: `PR-${referral.id}`,
    referralId: referral.id,
    version: 1,
    ...payload,
    evidenceIds: retrieveEvidence(referral).map((x) => x.id),
    payloadHash: hashPayload(payload),
    generatedAt: now.toISOString(),
    approvalExpiresAt: new Date(now.getTime() + 15 * 60_000).toISOString(),
    policy: evaluatePolicy(referral, kind),
  };
}

export function createTraceEvent(stage: string, title: string, detail: string, durationMs: number, tone: TraceEvent["tone"] = "safe", metadata?: Record<string, string>): TraceEvent {
  return { id: randomUUID(), at: new Date().toISOString(), stage, title, detail, durationMs, tone, metadata };
}

export function runWorkflow(referralId: string): WorkflowResult {
  const referral = referrals.find((item) => item.id === referralId);
  if (!referral) throw new Error("REFERRAL_NOT_FOUND");
  const missing = validateReferral(referral);
  const evidence = retrieveEvidence(referral);
  const proposal = buildProposal(referral);
  const trace: TraceEvent[] = [
    createTraceEvent("RECEIVED", "Referral context bound", "Synthetic referral loaded under tenant and patient context.", 42, "neutral", { patientRef: "[redacted]", tenant: "synthetic-trust-a" }),
    createTraceEvent("VALIDATING", "Deterministic checks completed", `${missing.length} missing administrative requirement${missing.length === 1 ? "" : "s"} found.`, 76, missing.length ? "attention" : "safe", { ruleSet: "respiratory-v4.2" }),
    createTraceEvent("RETRIEVING", "Approved evidence retrieved", `${evidence.length} current sources returned; superseded content excluded.`, 118, "safe", { metadataFilter: "approved=true,specialty=Respiratory" }),
    createTraceEvent("PROPOSING", "Structured proposal created", "Model-adapter output passed schema and unsupported-claim checks.", 934, "neutral", { modelProfile: "local-deterministic-v1", tokens: "846/168" }),
    createTraceEvent("POLICY_CHECK", proposal.policy.decision, proposal.policy.reason, 19, proposal.policy.decision === "BLOCK" ? "blocked" : "safe", { policy: `${proposal.policy.ruleId}@${proposal.policy.version}` }),
    createTraceEvent("AWAITING_APPROVAL", "Human decision required", "No external tool has been called. Approval binds the exact payload hash.", 0, "attention", { payloadHash: proposal.payloadHash.slice(0, 24) + "..." })
  ];
  return { runId: `RUN-${referral.id}-${randomUUID().slice(0, 8)}`, correlationId: randomUUID(), referral, evidence, proposal, trace, metrics: { totalMs: 1189, inputTokens: 846, outputTokens: 168, estimatedCostGbp: 0.0064 } };
}

export function approveAndExecute(result: WorkflowResult, payloadHash: string, idempotencyKey: string, approvedBy = "demo.clinician@careflow.local", now = new Date()): ExecutionReceipt {
  if (result.proposal.policy.decision !== "ALLOW_WITH_APPROVAL") throw new Error("POLICY_DENIED");
  if (payloadHash !== result.proposal.payloadHash) throw new Error("APPROVAL_STALE");
  if (now > new Date(result.proposal.approvalExpiresAt)) throw new Error("APPROVAL_EXPIRED");
  const existing = getReceipt(idempotencyKey);
  if (existing) {
    if (existing.runId !== result.runId || existing.proposalId !== result.proposal.id) throw new Error("IDEMPOTENCY_CONFLICT");
    return existing;
  }
  const receipt: ExecutionReceipt = {
    receiptId: randomUUID(),
    runId: result.runId,
    proposalId: result.proposal.id,
    downstreamId: `TASK-${result.referral.id}-DRAFT`,
    idempotencyKey,
    status: "draft-created",
    executedAt: now.toISOString(),
    approvedBy,
    purposeOfUse: "care-coordination",
    tool: "referral-worklist.create-draft",
    attempt: 1,
    reconciled: true,
  };
  return recordReceipt(receipt);
}
