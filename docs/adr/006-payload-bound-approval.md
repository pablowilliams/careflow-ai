# ADR-006: bind approval to exact payload

**Status:** accepted.

An approval records the proposal version, SHA-256 payload hash, human identity, policy version, destination, purpose, and expiry. Any material edit requires a new proposal version and fresh approval. Execution also requires an idempotency key. This prevents stale or substituted content from inheriting a prior decision.
