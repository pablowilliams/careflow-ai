import type { Evidence, Referral } from "./types";

export const referrals: Referral[] = [
  {
    id: "SR-240901-0187", patientRef: "PAT-7F31", specialty: "Respiratory", requester: "North West Primary Care Network",
    receivedAt: "2026-09-04T08:42:00Z", status: "needs-review", priority: "routine",
    reason: "Persistent cough and breathlessness for twelve weeks", requestedService: "Respiratory outpatient assessment",
    facts: { "Patient identifier": "PAT-7F31", "Referrer": "Dr A. Shah", "Symptom duration": "12 weeks", "Chest X-ray date": "Not supplied", "Smoking status": "Former smoker", "Contact preference": "SMS" },
    missingFields: ["Recent chest X-ray report", "Current oxygen saturation"], documentIds: ["DOC-RSP-REF-187"]
  },
  {
    id: "SR-240901-0188", patientRef: "PAT-2A90", specialty: "Respiratory", requester: "Harrow Family Practice",
    receivedAt: "2026-09-04T09:07:00Z", status: "ready", priority: "routine",
    reason: "Suspected sleep apnoea", requestedService: "Sleep clinic assessment",
    facts: { "Patient identifier": "PAT-2A90", "Referrer": "Dr N. Patel", "ESS score": "15", "BMI": "31", "Contact preference": "Email" },
    missingFields: [], documentIds: ["DOC-RSP-REF-188"]
  },
  {
    id: "SR-240901-0191", patientRef: "PAT-0C44", specialty: "Cardiology", requester: "Brent Integrated Care",
    receivedAt: "2026-09-04T10:19:00Z", status: "escalated", priority: "urgent",
    reason: "Intermittent palpitations", requestedService: "Cardiology advice and guidance",
    facts: { "Patient identifier": "PAT-0C44", "Referrer": "Dr J. Lewis", "ECG": "Conflicting attachments", "Contact preference": "Telephone" },
    missingFields: ["Confirmed ECG attachment"], documentIds: ["DOC-CAR-REF-191"]
  },
  {
    id: "SR-240903-0202", patientRef: "PAT-923B", specialty: "Respiratory", requester: "West London Medical Centre",
    receivedAt: "2026-09-03T15:31:00Z", status: "completed", priority: "routine",
    reason: "Asthma review", requestedService: "Respiratory advice and guidance",
    facts: { "Patient identifier": "PAT-923B", "Referrer": "Dr E. Moore", "Peak flow diary": "Attached", "Contact preference": "SMS" },
    missingFields: [], documentIds: ["DOC-RSP-REF-202"]
  }
];

export const evidenceLibrary: Evidence[] = [
  {
    id: "KB-RSP-001", title: "Adult respiratory referral pathway", owner: "Northwest London Respiratory Network",
    version: "4.2", section: "2.1 - Minimum referral information", effectiveFrom: "2026-04-01", expiresAt: "2027-03-31", approved: true, specialty: "Respiratory",
    excerpt: "Routine referrals for persistent cough should include a recent chest X-ray report and current oxygen saturation when available. If either is absent, request the missing information before pathway submission."
  },
  {
    id: "KB-RSP-007", title: "Referral communications standard", owner: "Northwest London Access Collaborative",
    version: "2.0", section: "4.3 - Requests for information", effectiveFrom: "2026-06-01", expiresAt: "2027-05-31", approved: true, specialty: "Respiratory",
    excerpt: "Requests for missing referral information must identify the referral, list only the required items, avoid clinical interpretation, and provide a route for the referrer to respond."
  },
  {
    id: "KB-OLD-003", title: "Legacy respiratory pathway", owner: "Archive",
    version: "1.8", section: "Referral criteria", effectiveFrom: "2022-01-01", expiresAt: "2024-03-31", approved: false, specialty: "Respiratory",
    excerpt: "This document is superseded and must never be used in proposals."
  }
];

export const evaluationStats = {
  precision: 0.991, recall: 0.967, citationValidity: 1, abstention: 0.994, unauthorizedWrites: 0,
  injectionBypasses: 0, cases: 320, lastRun: "2026-09-04T07:30:00Z"
};
