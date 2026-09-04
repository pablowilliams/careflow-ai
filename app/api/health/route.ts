import { NextResponse } from "next/server";
import packageJson from "@/package.json";
import { runtimeSnapshot } from "@/lib/runtime-store";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "careflow-ai",
    version: packageJson.version,
    environment: "synthetic-sandbox",
    region: process.env.AWS_REGION ?? "eu-west-2-target",
    timestamp: new Date().toISOString(),
    controls: {
      defaultDeny: true,
      exactPayloadApproval: true,
      writeKillSwitch: process.env.CAREFLOW_WRITE_KILL_SWITCH === "true",
      syntheticDataOnly: true,
      traceRedaction: true,
    },
    dependencies: {
      workflow: { status: "healthy", adapter: "local-deterministic" },
      policy: { status: "healthy", version: "3.1" },
      knowledge: { status: "healthy", approvedDocuments: 2 },
      toolGateway: { status: "healthy", mode: "simulated-draft-only" },
    },
    runtime: runtimeSnapshot(),
  }, { headers: { "Cache-Control": "no-store" } });
}
