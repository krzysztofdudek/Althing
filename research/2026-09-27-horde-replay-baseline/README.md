# Horde replay baseline (run i)

**Question:** How does Horde as it stood on `release/6.1.0` (`bbd50bb`) perform on closed Yggdrasil tickets whose later defects are known?

**Method:** Eight tickets replayed from their base commits in scratch clones, with four metrics registered before any run (owner time, known defect caught, red CI after merge, a blind diff grade by a fresh reviewer) and operator rules recorded when added.

**Status:** concluded

**Conclusion:** Two of eight landed, one known defect of eight was caught, and the blind grade was below the historical change on both (3.25 against 4.5); planning caps stopped six missions. Runs (ii) and (iii) were later replaced by a smoke check.

## What is here

- [report.md](report.md): the set, the metrics, the per-ticket results and what drove them
- [materials/registered-metrics.md](materials/registered-metrics.md): the metrics and rules as registered
- [materials/registered-at.txt](materials/registered-at.txt): when they were registered
- `materials/grade/`: the blind grading pool: the historical and Horde diffs for 308 and 332, and the key

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. Fake API keys in the test code of the diffs are written `<fake key: …>` so that the secret rail does not read them as keys; the diffs no longer apply as patches.
