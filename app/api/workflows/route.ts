import { NextResponse } from "next/server";
import { z } from "zod";
import { runWorkflow } from "@/lib/engine";
import { recordRun } from "@/lib/runtime-store";

const requestSchema = z.object({ referralId: z.string().min(1) });

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ code: "REQUEST_INVALID", title: "The workflow request is invalid", errors: parsed.error.issues }, { status: 400 });
  try {
    return NextResponse.json(recordRun(runWorkflow(parsed.data.referralId)), { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ code: "REFERRAL_NOT_FOUND", title: "The referral could not be found", detail: "Choose a referral from the synthetic queue." }, { status: 404 });
  }
}
