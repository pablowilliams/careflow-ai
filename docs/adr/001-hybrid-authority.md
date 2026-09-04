# ADR-001: use hybrid deterministic authority

**Status:** accepted for portfolio POC.

## Decision

Use deterministic services for validation, state, authorization, approval, and execution. Use a bounded model adapter only for evidence-linked drafting.

## Consequences

The architecture is less conversational but substantially easier to authorize, test, explain, and recover. More logic must be maintained as explicit policy and rules. This is appropriate for the narrow administrative use case.
