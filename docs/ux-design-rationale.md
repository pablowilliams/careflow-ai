# UX design rationale

CareFlow uses a staff-facing operational service pattern rather than a product-marketing dashboard.

## References

- [NHS digital service manual](https://service-manual.nhs.uk/) — plain language, accessibility and consistency for health services.
- [GOV.UK task list](https://design-system.service.gov.uk/components/task-list/) — whole-row actions, short task names and clear sentence-case status.
- [PatternFly dashboard guidance](https://www.patternfly.org/patterns/dashboard/design-guidelines/) — prioritize information by user need and keep each summary focused.
- [PatternFly usage and behavior](https://www.patternfly.org/design-foundations/usage-and-behavior/) — use tables and lists for structured operational records.

## Applied decisions

- The landing view is a searchable, filterable referral worklist rather than a promotional hero.
- The primary action is the coordinator's next review, not a generic product tour.
- Status uses short, sentence-case labels and is secondary to the linked referral row.
- The detail view keeps source facts, administrative findings, evidence, proposed action and approval in the order of the real task.
- Technical detail remains available in audit, safety and architecture views without dominating routine work.
- Colour communicates service hierarchy and status; decoration is deliberately restrained.
- Synthetic and non-production boundaries remain visible at the point of use.
