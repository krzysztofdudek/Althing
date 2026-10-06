# Yggdrasil 6.1.0: release readiness

**Question:** Can Yggdrasil `release/6.1.0` ship, with Horde and Grain on their release branches and Jarl at its tip?

**Method:** Five angles (a real upgrade, the upgrade docs, the first hour again, the daily loop again, the family) on the candidate `1f82edbb`, each finding checked by a separate verifier.

**Status:** concluded

**Conclusion:** Ready with fixes, not at the current tips: one blocker in the family (Horde's `promises` package), majors in how the upgrade is described and in the contracts, and a recommendation to release it as 7.0.0 rather than 6.1.0.

## What is here

- [report.md](report.md): the verdict and findings
- [findings.json](findings.json): every verified finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path.
