# Security policy

## Supported scope

CareFlow AI is a synthetic portfolio demonstration. It must not receive real patient, workforce, referral, or production credential data.

## Reporting

Do not open a public issue containing sensitive information. Contact the repository owner privately with a concise reproduction, affected version, impact, and suggested mitigation.

## Security properties demonstrated

- Default-deny authorization for consequential actions.
- Exact-payload, run, actor, purpose and expiry-bound approval.
- Server-side write kill switch.
- Idempotency conflict detection and reconciled receipts.
- Approved/effective evidence filtering and provenance.
- Redacted safety traces and downloadable incident bundles.
- CSP, clickjacking, MIME-sniffing, referrer and browser-permission headers.
- Encrypted AWS target-state foundations and least-privilege tool contracts.

## Non-production boundary

The local identity and downstream tool are controlled simulations. Production use requires organisation-owned identity federation, durable encrypted workflow state, approved NHS FHIR integration, formal threat modelling, penetration testing, DPIA, clinical safety work and operational authorization.
