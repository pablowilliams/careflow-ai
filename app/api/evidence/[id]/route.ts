import { NextResponse } from "next/server";
import { evidenceLibrary } from "@/lib/data";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const evidence = evidenceLibrary.find((item) => item.id === id && item.approved);
  if (!evidence) return NextResponse.json({ code: "EVIDENCE_NOT_FOUND", title: "Approved evidence not found" }, { status: 404 });
  return NextResponse.json({ ...evidence, provenance: { ingestion: "signed-release-manifest", checksum: `sha256:${id.toLowerCase()}-synthetic`, reviewStatus: "approved", synthetic: true } }, { headers: { "Cache-Control": "public, max-age=300" } });
}
