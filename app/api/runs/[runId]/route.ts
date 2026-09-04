import { NextResponse } from "next/server";
import { getRun } from "@/lib/runtime-store";

export async function GET(_: Request, { params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run = getRun(runId);
  if (!run) return NextResponse.json({ code: "RUN_NOT_FOUND", title: "Run not found" }, { status: 404 });

  return NextResponse.json({
    schemaVersion: "1.0",
    exportedAt: new Date().toISOString(),
    classification: "synthetic-portfolio-data",
    run,
    controls: {
      rawPatientTextInTrace: false,
      policyReevaluatedAtExecution: true,
      exactPayloadBinding: true,
      idempotentTool: true,
    },
  }, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="${runId}-incident-bundle.json"`,
    },
  });
}
