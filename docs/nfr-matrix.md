# Non-functional requirements

| Category | Initial target | Evidence | Owner | Status |
|---|---|---|---|---|
| Availability | 99.9% monthly coordinator workflow | Architecture calculation and synthetic monitor | Service owner | Proposed |
| Latency | p95 proposal under 20s; acknowledge under 500ms | Load test and traces | Tech lead | POC measured locally |
| Recovery | RTO 2h; RPO 15m workflow state | Restore and failure drill | SRE | Design only |
| Scale | 50 concurrent workflows; 10k referrals/day | Load profile and quota review | Architect | Design only |
| Safety | Zero unapproved external writes | E2E approval/policy tests | CSO/Product | Enforced in POC |
| Security | Least privilege; no critical findings | Threat model and scans | Security | POC baseline |
| Accessibility | WCAG 2.2 AA target | Automated and manual review | Product | In progress |
| Observability | Every workflow correlated end to end | Trace completeness check | SRE | Enforced in POC |
| Cost | Per-workflow cost visible and budgeted | Dashboard and estimates | FinOps | Demonstrated |

An exception must identify owner, expiry, compensating control, user impact, and approval.
