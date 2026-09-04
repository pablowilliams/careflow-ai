# Runbook: write kill switch

1. Trigger on suspected unauthorized action, cross-context error, material policy defect, or missing audit guarantee.
2. Set the environment control to block new write commands.
3. Leave read-only referral visibility and manual queue available.
4. Confirm gateway policy and workflow alarms show the block.
5. Reconcile in-flight and uncertain commands.
6. Notify service, safety, security, privacy, and operational owners according to incident classification.
7. Resume only after the defect, evidence, approval, and rollback decision are recorded.
