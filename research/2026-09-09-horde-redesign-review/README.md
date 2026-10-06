# An independent design review of Horde's model

**Question:** Which assumptions of Horde 0.4's model did its first real missions falsify, and what model would not have those flaws?

**Method:** A four-part, read-only review by a separate model instance on 2026-09-09, against Horde `main` (0.4.0 and its unreleased block), Yggdrasil 5.9.0's docs, the two mission reports of 7–8 September, the triage that checked every reported item against the code, and the 6.0.0 decisions D0–D3.

**Status:** concluded

**Conclusion:** It states seventeen assumptions of the model and which of them the missions falsified, keeps what the missions proved right, and proposes a model built on territories as the lease unit, one queue and counter for tickets and graph items, approvals that scale with the graph and a merge checklist; it says what to drop and orders the migration inside 6.0.0.

## What is here

- [review.md](review.md): part 1, the assumptions and what the mission did to them; part 2, a model without the flaws; part 3, what to drop; part 4, the migration

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. The two mission reports it rests on are field reports from a private deployment; their origin is not named here. Item numbers are the reports' (`H15`, `Y5`), and verdicts quoted as "confirmed" or "disproved" are the triage's. The one finding it adds beyond the reports (the verifier is briefed into the worker's worktree) was checked in `brief.mjs` before it was filed. It was input to the 6.0.0 decisions, not a decision itself.
