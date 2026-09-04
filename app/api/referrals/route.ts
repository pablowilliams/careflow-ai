import { NextResponse } from "next/server";
import { referrals } from "@/lib/data";

export async function GET() {
  return NextResponse.json({ data: referrals, meta: { synthetic: true, count: referrals.length } });
}
