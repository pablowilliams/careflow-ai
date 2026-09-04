# CareFlow AI

CareFlow AI is a portfolio-grade, governed agentic-AI reference implementation for synthetic NHS referral coordination. It checks administrative completeness, retrieves approved pathway evidence, drafts a narrow information request, applies deterministic policy, requires context-bound exact-payload human approval, and creates one idempotent draft work item with a reconciled execution receipt.

It is deliberately not a medical device, clinical decision system, or production NHS integration. It contains no real patient data and makes no diagnostic, urgency, treatment, or autonomous communication decisions.

## What to show in the demo

1. Open **Service overview** and explain the control model.
2. Choose `SR-240901-0187` from the synthetic queue.
3. Run the governed review.
4. Verify deterministic missing fields and two current approved sources.
5. Review the AI-labelled draft and policy `POL-WRITE-011@3.1`.
6. Approve the exact payload and inspect the idempotent draft receipt.
7. Open **Agent operations** to inspect redacted spans, latency, tokens, cost, and controls.
8. Open **Assurance centre** for evaluation gates, hazards, and the production block.
9. Open **Architecture** for AWS target state and ADRs.

Every visible evidence, source, runbook, assurance, ADR, health, and export control is connected to a working endpoint.

## Quick start

Requires Node.js 22+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To verify everything:

```bash
npm run check
```

## Implemented

- Responsive React/TypeScript experience for coordinators and operators.
- Synthetic FHIR-shaped `ServiceRequest` referrals.
- Deterministic completeness rules and policy decisions.
- Approved/effective/specialty-scoped evidence retrieval with citations.
- Structured proposal and SHA-256 payload binding.
- Expiring, run-bound human approval carrying actor, purpose-of-use, policy and exact payload context.
- Idempotent draft execution with cross-context key-conflict protection and reconciliation evidence.
- Safe blocks for urgent and out-of-scope referrals.
- Runtime write kill switch enforced server-side.
- Redacted execution trace with latency, token, cost, actor, purpose, policy, tool and version evidence.
- Downloadable incident bundles and an aggregated assurance pack.
- FHIR R4-compatible synthetic `ServiceRequest` endpoint and evidence provenance endpoints.
- Live dependency/control health endpoint and connected operator UI.
- Assurance dashboard, synthetic evaluation report, clinical hazard starter, DPIA starter, NFR matrix, threat model, workshop pack, runbooks, and ADRs.
- OpenAPI contract and governed MCP tool catalog.
- Terraform foundations for KMS, S3, DynamoDB, CloudWatch, kill switch, and budget.
- CI for lint, typecheck, tests, build, Terraform formatting, and validation.
- Hardened HTTP response headers and a non-root, read-only, standalone production container.

## Architecture invariant

> The model proposes. Deterministic services validate and authorize. An accountable human approves. A narrow tool performs one idempotent action. The platform records evidence end to end.

See [docs/architecture.md](docs/architecture.md), [contracts/openapi.yaml](contracts/openapi.yaml), and [contracts/mcp-tools.json](contracts/mcp-tools.json).

## Production adapters

The local model, retrieval, workflow, and tool behavior is deterministic so the entire control path can run without credentials. The target AWS adapters are:

- Bedrock AgentCore Runtime and an approved Bedrock model profile.
- Bedrock Knowledge Bases or a custom approved retriever.
- AgentCore Gateway for MCP tools and workload identity.
- Step Functions Standard/EventBridge for durable orchestration.
- DynamoDB/KMS for workflow, approvals, receipts, and TTL.
- CloudWatch and OpenTelemetry for redacted observability.
- Organization-specific workforce federation and NHS FHIR APIs.

These cannot be safely completed without a target AWS organization, region/service decision, identity provider, network, NHS API profiles, information-governance decisions, and clinical/security approval. The repository represents those dependencies honestly instead of embedding fictitious production credentials or permissions.

## Assurance material

- [Discovery workshop](docs/workshop-pack.md)
- [Threat model](docs/threat-model.md)
- [Clinical hazard log starter](docs/clinical-hazard-log.md)
- [DPIA starter](docs/dpia-starter.md)
- [NFR matrix](docs/nfr-matrix.md)
- [Synthetic evaluation report](docs/evaluation-report.md)
- [Uncertain-write runbook](docs/runbooks/uncertain-write.md)
- [Kill-switch runbook](docs/runbooks/kill-switch.md)

## API and safety notes

The API is intentionally narrow. `/api/workflows` is read/propose only. `/api/approvals` loads the recorded run, verifies referral context, actor, purpose, expiry, exact content and hash, re-applies deterministic execution controls, and uses a context-safe idempotency key before returning a reconciled draft receipt. `/api/runs/{runId}` exports the redacted incident bundle; `/api/health` exposes operational and control posture.

The local runtime registry is explicitly process-scoped. The documented production adapter replaces it with encrypted DynamoDB workflow, approval and receipt records without changing the API boundary.

## Useful endpoints

- `GET /api/health` — dependency and control posture.
- `GET /api/referrals` — synthetic coordinator worklist.
- `GET /api/fhir/ServiceRequest/{id}` — synthetic FHIR R4 representation.
- `POST /api/workflows` — governed review and proposal.
- `POST /api/approvals` — context-bound approval and one narrow tool execution.
- `GET /api/runs/{runId}` — downloadable, redacted incident bundle.
- `GET /api/evidence/{id}` — approved evidence and provenance.
- `GET /api/artifacts/assurance-pack?download=1` — consolidated assurance material.

## Repository quality

`npm run check` runs ESLint, strict TypeScript, safety tests and a production build. Terraform formatting and validation run in CI. Dependencies are audited before release. See [SECURITY.md](SECURITY.md) for reporting and the portfolio security boundary.

## License and data

All records are fictional and deterministic. Product names belong to their owners. This project demonstrates architecture practice and does not claim NHS, clinical, legal, security, or regulatory approval.
