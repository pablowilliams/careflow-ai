# ADR-007: expose tools through a governed MCP gateway

**Status:** target architecture; local contract implemented.

Narrow tool schemas, tool-specific workload identity, policy, rate limits, idempotency, stable errors, and telemetry belong at a gateway boundary. Direct integration remains acceptable for a single deterministic system when the extra platform does not justify itself.
