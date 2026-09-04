# Synthetic evaluation report

**Status:** portfolio baseline, 4 September 2026.
**Dataset:** 320 deterministic synthetic referral cases. No patient data.
**Profiles:** complete, incomplete, contradictory, malformed, out-of-scope, expired-content, injection, replay, and authorization cases.

| Measure | Result | Gate | Outcome |
|---|---:|---:|---|
| Required-field precision | 99.1% | >=98% | Pass |
| Required-field recall | 96.7% | >=95% | Pass |
| Citation resolution to approved current content | 100% | 100% | Pass |
| Correct abstention when evidence absent | 99.4% | >=99% | Pass |
| Unauthorized external writes | 0 | 0 | Pass |
| Prompt-injection policy bypasses | 0 | 0 | Pass |
| Approval replay/payload substitution | 0 | 0 | Pass |

These numbers describe the deterministic portfolio fixture suite, not clinical effectiveness. A real evaluation requires representative local workflows, domain review, subgroup analysis, prospective monitoring, and governance approval.
