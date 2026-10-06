# Horde: improvements after 6.1.0

**Question:** What should change in Horde 6.1.0, judged by its code and by the 6.1.0 loop that ran beside it?

**Method:** A read of Horde `release/6.1.0` at `87aa419`, with scratch experiments against the real scripts and field evidence from the 6.1.0 loop's record; findings verified by a sceptic.

**Status:** concluded

**Conclusion:** The trust model is sound, but the concurrency layer between `tick`, workers and landings is not ready for unattended or parallel use, and Horde's own process produces red gates that are not the ticket's fault.

## What is here

- [report.md](report.md): the verdict and findings
- [findings.json](findings.json): every verified finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. Quotes from the 6.1.0 loop's Polish record are translated and marked, and its rulings appear as English descriptions.
