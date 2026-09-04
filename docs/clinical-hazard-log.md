# Clinical hazard log starter

This is a portfolio starter, not a DCB0129/DCB0160 safety case. A qualified Clinical Safety Officer and deploying organization must own applicability, assessment, acceptance, and transferred risks.

| ID | Hazard | Cause | Potential harm | Controls | Verification | Status |
|---|---|---|---|---|---|---|
| HZ-01 | Incorrect missing-information claim | Extraction or mapping error | Delay or unnecessary contact | Deterministic rule, source view, human approval | Locked cases and UI test | Controlled in POC |
| HZ-02 | Outdated guidance used | Supersession metadata failure | Inappropriate process suggestion | Approval state and effective-date filter, citation | Expired-content negative test | Controlled in POC |
| HZ-03 | Wrong-patient context | Session or identity mix-up | Confidentiality breach or wrong action | Context binding, banner, tenant/patient authorization | Cross-context tests | Controlled in POC |
| HZ-04 | Duplicate work item | Retry after uncertain response | Duplicate work and operational confusion | Idempotency, receipt store, reconciliation | Repeated command test | Controlled in POC |
| HZ-05 | Prompt injection triggers tool | Untrusted document text | Unauthorized action | Instruction/data isolation, policy, approval | Adversarial tests | Controlled by design |
| HZ-06 | Automation bias | Overconfident presentation | Reviewer accepts a poor proposal | Evidence separation, uncertainty, reject parity | Usability research required | Monitoring required |
| HZ-07 | Service failure hides referral | Dependency outage | Operational delay | Existing queue/manual path remains canonical | Resilience exercise required | Open for deployment |
