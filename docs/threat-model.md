# Threat model

## Assets and trust boundaries

Assets include referral context, workforce identity, approved knowledge, proposals, approval decisions, tool credentials, downstream receipts, policies, model configuration, and audit evidence. Trust boundaries exist at the browser/API, workflow/model, retrieval store, tool gateway, downstream FHIR service, and observability export.

| Threat | Control | Verification |
|---|---|---|
| Prompt injection in referral, knowledge, or tool output | Treat all content as data; immutable system policy; gateway validates tool calls | Adversarial corpus for every input channel |
| Cross-tenant retrieval | Tenant partition and mandatory metadata filters | Canary and property-based isolation tests |
| Excessive tool agency | Per-tool identity, default deny, risk classification, approval | Negative authorization matrix |
| Confused deputy | Bind subject, tenant, patient, purpose, action and resource | Policy unit and integration tests |
| Replay or duplicate write | Expiring approval, payload hash, nonce, idempotency key | Replay and timeout-after-commit tests |
| Credential exfiltration | Workload identity; secrets never enter prompts/logs | Secret scan and egress review |
| Sensitive telemetry | Allowlist structured events, redaction, separate audit/trace retention | Snapshot audit and canary identifiers |
| Cost denial of service | WAF, quotas, maximum steps/tokens/time, budgets | Load and cost-abuse tests |

## Security boundary

This portfolio build uses synthetic records and a local deterministic adapter. It is not authorized for real NHS data. Production requires local security architecture, data residency confirmation, penetration testing, supplier assurance, and incident integration.
