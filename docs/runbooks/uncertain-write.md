# Runbook: uncertain downstream write

1. Confirm the workflow is in `UNCERTAIN`; disable automatic retry.
2. Capture correlation ID, approval ID, payload hash, idempotency key, destination, and request time.
3. Use a read-only downstream lookup by idempotency key.
4. If a matching receipt exists, record it and transition to `SUCCEEDED` without another write.
5. If the downstream conclusively reports no write, an authorized operator may create a new execution command.
6. If the result remains ambiguous, escalate to the service owner; do not retry.
7. Review whether telemetry, timeout, or API contract changes are required.
