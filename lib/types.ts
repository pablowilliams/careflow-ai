export type ReferralStatus = "needs-review" | "ready" | "escalated" | "completed";
export type RiskTone = "safe" | "attention" | "blocked" | "neutral";

export interface Referral {
  id: string;
  patientRef: string;
  specialty: string;
  requester: string;
  receivedAt: string;
  status: ReferralStatus;
  priority: "routine" | "urgent";
  reason: string;
  requestedService: string;
  facts: Record<string, string>;
  missingFields: string[];
  documentIds: string[];
}

export interface Evidence {
  id: string;
  title: string;
  owner: string;
  version: string;
  section: string;
  effectiveFrom: string;
  expiresAt: string;
  excerpt: string;
  approved: boolean;
  specialty: string;
}

export interface Proposal {
  id: string;
  referralId: string;
  version: number;
  kind: "information-request" | "no-action" | "escalation";
  recipient: string;
  subject: string;
  body: string;
  evidenceIds: string[];
  payloadHash: string;
  generatedAt: string;
  approvalExpiresAt: string;
  policy: PolicyDecision;
}

export interface PolicyDecision {
  decision: "ALLOW_WITH_APPROVAL" | "BLOCK" | "ALLOW_READ";
  ruleId: string;
  version: string;
  reason: string;
  requiresHumanApproval: boolean;
}

export interface TraceEvent {
  id: string;
  at: string;
  stage: string;
  title: string;
  detail: string;
  durationMs: number;
  tone: RiskTone;
  metadata?: Record<string, string>;
}

export interface WorkflowResult {
  runId: string;
  correlationId: string;
  referral: Referral;
  evidence: Evidence[];
  proposal: Proposal;
  trace: TraceEvent[];
  metrics: { totalMs: number; inputTokens: number; outputTokens: number; estimatedCostGbp: number };
}

export interface ExecutionReceipt {
  receiptId: string;
  runId: string;
  proposalId: string;
  downstreamId: string;
  idempotencyKey: string;
  status: "draft-created";
  executedAt: string;
  approvedBy: string;
  purposeOfUse: "care-coordination";
  tool: "referral-worklist.create-draft";
  attempt: number;
  reconciled: boolean;
}
