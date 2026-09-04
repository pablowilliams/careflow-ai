import { NextResponse } from "next/server";
import { referrals } from "@/lib/data";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const referral = referrals.find((item) => item.id === id);
  if (!referral) return NextResponse.json({ resourceType: "OperationOutcome", issue: [{ severity: "error", code: "not-found", diagnostics: "Synthetic ServiceRequest not found" }] }, { status: 404, headers: { "Content-Type": "application/fhir+json" } });

  return NextResponse.json({
    resourceType: "ServiceRequest",
    id: referral.id,
    meta: { profile: ["http://hl7.org/fhir/StructureDefinition/ServiceRequest"], security: [{ system: "http://terminology.hl7.org/CodeSystem/v3-Confidentiality", code: "R", display: "Restricted synthetic data" }] },
    identifier: [{ system: "https://careflow.local/referral", value: referral.id }],
    status: referral.status === "completed" ? "completed" : "active",
    intent: "order",
    priority: referral.priority === "urgent" ? "urgent" : "routine",
    category: [{ text: referral.specialty }],
    code: { text: referral.requestedService },
    subject: { reference: `Patient/${referral.patientRef}`, display: "Synthetic patient" },
    authoredOn: referral.receivedAt,
    requester: { display: referral.requester },
    reasonCode: [{ text: referral.reason }],
    supportingInfo: referral.documentIds.map((documentId) => ({ reference: `DocumentReference/${documentId}` })),
    note: [{ text: "Synthetic portfolio resource. Not for clinical use." }],
  }, { headers: { "Content-Type": "application/fhir+json", "Cache-Control": "no-store", "X-Synthetic-Data": "true" } });
}
