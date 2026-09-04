import type { ExecutionReceipt, TraceEvent, WorkflowResult } from "./types";

interface RuntimeState {
  runs: Map<string, WorkflowResult>;
  receipts: Map<string, ExecutionReceipt>;
  startedAt: string;
}

const stateKey = Symbol.for("careflow.runtime-state");
const runtimeGlobal = globalThis as typeof globalThis & { [stateKey]?: RuntimeState };

function state(): RuntimeState {
  if (!runtimeGlobal[stateKey]) {
    runtimeGlobal[stateKey] = {
      runs: new Map(),
      receipts: new Map(),
      startedAt: new Date().toISOString(),
    };
  }
  return runtimeGlobal[stateKey];
}

export function recordRun(run: WorkflowResult) {
  state().runs.set(run.runId, structuredClone(run));
  return run;
}

export function getRun(runId: string) {
  return state().runs.get(runId);
}

export function appendTrace(runId: string, events: TraceEvent[]) {
  const run = state().runs.get(runId);
  if (!run) return;
  run.trace.push(...events);
}

export function getReceipt(idempotencyKey: string) {
  return state().receipts.get(idempotencyKey);
}

export function recordReceipt(receipt: ExecutionReceipt) {
  state().receipts.set(receipt.idempotencyKey, receipt);
  return receipt;
}

export function runtimeSnapshot() {
  return {
    adapter: "local-memory",
    startedAt: state().startedAt,
    activeRuns: state().runs.size,
    executionReceipts: state().receipts.size,
    durability: "process-scoped-demo",
  } as const;
}
