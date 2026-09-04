# ADR-009: treat AI components as evaluated dependencies

**Status:** accepted.

Model ID, inference settings, system instructions, retrieval configuration, content versions, tool schemas, and policies are versioned together. Every workflow records the versions used. A material change triggers the corresponding locked evaluation tier and supports rollback by version pointer.
