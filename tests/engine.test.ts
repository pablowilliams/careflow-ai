import assert from "node:assert/strict";
import test from "node:test";
import { approveAndExecute, buildProposal, hashPayload, retrieveEvidence, runWorkflow, validateReferral } from "../lib/engine";
import { evidenceLibrary, referrals } from "../lib/data";

test("deterministic validation combines mandatory and pathway fields", () => {
  assert.deepEqual(validateReferral(referrals[0]), ["Recent chest X-ray report", "Current oxygen saturation"]);
});

test("retrieval returns approved, effective, specialty-scoped evidence only", () => {
  const items = retrieveEvidence(referrals[0]);
  assert.equal(items.length, 2);
  assert.ok(items.every((item) => item.approved && item.specialty === "Respiratory"));
  assert.ok(!items.some((item) => item.id === evidenceLibrary[2].id));
});

test("urgent and out-of-scope referrals are blocked by deterministic policy", () => {
  const workflow = runWorkflow("SR-240901-0191");
  assert.equal(workflow.proposal.policy.decision, "BLOCK");
  assert.equal(workflow.trace.at(-1)?.stage, "AWAITING_APPROVAL");
});

test("proposal hash is stable and changes with content", () => {
  const proposal = buildProposal(referrals[0]);
  const expected = hashPayload({ kind: proposal.kind, recipient: proposal.recipient, subject: proposal.subject, body: proposal.body });
  assert.equal(proposal.payloadHash, expected);
  assert.notEqual(hashPayload({ body: proposal.body + " changed" }), proposal.payloadHash);
});

test("approval rejects a stale payload", () => {
  const workflow = runWorkflow(referrals[0].id);
  assert.throws(() => approveAndExecute(workflow, "sha256:stale", "stale-key-123"), /APPROVAL_STALE/);
});

test("execution is idempotent for the same approval command", () => {
  const workflow = runWorkflow(referrals[0].id);
  const first = approveAndExecute(workflow, workflow.proposal.payloadHash, "repeatable-key-123");
  const second = approveAndExecute(workflow, workflow.proposal.payloadHash, "repeatable-key-123");
  assert.deepEqual(second, first);
  assert.equal(first.status, "draft-created");
  assert.equal(first.approvedBy, "demo.clinician@careflow.local");
  assert.equal(first.reconciled, true);
});

test("approval expires and fails closed", () => {
  const workflow = runWorkflow(referrals[0].id);
  const afterExpiry = new Date(new Date(workflow.proposal.approvalExpiresAt).getTime() + 1);
  assert.throws(() => approveAndExecute(workflow, workflow.proposal.payloadHash, "expired-key-123", "reviewer@careflow.local", afterExpiry), /APPROVAL_EXPIRED/);
});

test("an idempotency key cannot be reused across workflow contexts", () => {
  const firstRun = runWorkflow(referrals[0].id);
  approveAndExecute(firstRun, firstRun.proposal.payloadHash, "context-key-123");
  const secondRun = runWorkflow(referrals[0].id);
  assert.throws(() => approveAndExecute(secondRun, secondRun.proposal.payloadHash, "context-key-123"), /IDEMPOTENCY_CONFLICT/);
});

test("trace records the complete governed path without raw patient text", () => {
  const workflow = runWorkflow(referrals[0].id);
  assert.deepEqual(workflow.trace.map((event) => event.stage), ["RECEIVED", "VALIDATING", "RETRIEVING", "PROPOSING", "POLICY_CHECK", "AWAITING_APPROVAL"]);
  assert.doesNotMatch(JSON.stringify(workflow.trace), /Persistent cough/);
  assert.match(JSON.stringify(workflow.trace), /\[redacted\]/);
});
