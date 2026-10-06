# Grain: what more mathematics and analytics can extract

**Question:** Where is Grain's mathematics sound, where does it use something weaker, and what more could it extract?

**Method:** A read of the engine's statistics against Grain's own recorded results, with prototype scripts run on cached models of public repositories; recommendations ranked with how each would be shown to work.

**Status:** concluded

**Conclusion:** The core mathematics is sound where the engine uses it; the weak spots (a flat coin as the null, raw shares as gates, wall-clock windows) match Grain's own negative results, and reading the `Co-Authored-By` trailer comes first among the fixes.

## What is here

- [report.md](report.md): the verdict and ranked recommendations
- [findings.json](findings.json): every finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. Its prototype scripts lived in a session scratchpad and were lost with it.
