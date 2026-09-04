import { NextResponse } from "next/server";
import { z } from "zod";
import { approveAndExecute, createTraceEvent } from "@/lib/engine";
import { appendTrace, getReceipt, getRun } from "@/lib/runtime-store";

const requestSchema = z.object({
  runId: z.string().startsWith("RUN-"),
  referralId: z.string(),
  payloadHash: z.string().startsWith("sha256:"),
  body: z.string().min(1),
  idempotencyKey: z.string().min(8),
  approvedBy: z.string().email(),
  purposeOfUse: z.literal("care-coordination"),
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ code: "REQUEST_INVALID", title: "Approval details are incomplete", errors: parsed.error.issues }, { status: 400 });
  try {
    if (process.env.CAREFLOW_WRITE_KILL_SWITCH === "true") throw new Error("WRITE_KILL_SWITCH_ACTIVE");
    const workflow = getRun(parsed.data.runId);
    if (!workflow) return NextResponse.json({ code: "RUN_NOT_FOUND", title: "The reviewed run is no longer available", detail: "Run the governed review again before approving." }, { status: 410 });
    if (workflow.referral.id !== parsed.data.referralId) throw new Error("CONTEXT_MISMATCH");
    if (parsed.data.body !== workflow.proposal.body) throw new Error("APPROVAL_STALE");
    const replay = Boolean(getReceipt(parsed.data.idempotencyKey));
    const receipt = approveAndExecute(workflow, parsed.data.payloadHash, parsed.data.idempotencyKey, parsed.data.approvedBy);
    if (!replay) appendTrace(workflow.runId, [
      createTraceEvent("APPROVED", "Exact proposal approved", "Verified workforce actor approved the bound proposal for care coordination.", 31, "safe", { actor: parsed.data.approvedBy, purposeOfUse: parsed.data.purposeOfUse }),
      createTraceEvent("TOOL_EXECUTION", "Draft work item created", "The allowlisted tool returned a reconciled idempotent receipt.", 87, "safe", { tool: receipt.tool, downstreamId: receipt.downstreamId }),
    ]);
    return NextResponse.json(receipt, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const code = error instanceof Error ? error.message : "EXECUTION_FAILED";
    const stale = code === "APPROVAL_STALE" || code === "APPROVAL_EXPIRED" || code === "CONTEXT_MISMATCH" || code === "IDEMPOTENCY_CONFLICT";
    const killSwitch = code === "WRITE_KILL_SWITCH_ACTIVE";
    return NextResponse.json({ code, title: killSwitch ? "Write execution is temporarily disabled" : stale ? "This approval is no longer valid" : "Policy prevented execution", detail: killSwitch ? "The operational kill switch is active. No tool was called." : stale ? "Run the governed review again and approve the current, context-bound payload." : "This action is not permitted in the current context." }, { status: killSwitch ? 503 : stale ? 409 : 403 });
  }
}
