import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const artifacts: Record<string, string> = {
  architecture: "architecture.md",
  "hazard-register": "clinical-hazard-log.md",
  "evaluation-report": "evaluation-report.md",
  "threat-model": "threat-model.md",
  "dpia-starter": "dpia-starter.md",
  "nfr-matrix": "nfr-matrix.md",
  "workshop-pack": "workshop-pack.md",
  "uncertain-write-runbook": "runbooks/uncertain-write.md",
  "kill-switch-runbook": "runbooks/kill-switch.md",
  "adr-001": "adr/001-hybrid-authority.md",
  "adr-006": "adr/006-payload-bound-approval.md",
  "adr-007": "adr/007-governed-mcp-gateway.md",
  "adr-009": "adr/009-evaluated-dependencies.md",
};

const assuranceSlugs = ["architecture", "threat-model", "hazard-register", "dpia-starter", "nfr-matrix", "evaluation-report", "uncertain-write-runbook", "kill-switch-runbook"];

async function load(slug: string) {
  const relative = artifacts[slug];
  if (!relative) return null;
  return readFile(path.join(process.cwd(), "docs", relative), "utf8");
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const download = new URL(request.url).searchParams.get("download") === "1";
  const content = slug === "assurance-pack"
    ? (await Promise.all(assuranceSlugs.map(async (item) => `\n\n---\n\n${await load(item)}`))).join("")
    : await load(slug);

  if (!content) return NextResponse.json({ code: "ARTIFACT_NOT_FOUND", title: "Artifact not found" }, { status: 404 });
  const filename = slug === "assurance-pack" ? "careflow-assurance-pack.md" : `${slug}.md`;
  return new NextResponse(content.trimStart(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=300",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
