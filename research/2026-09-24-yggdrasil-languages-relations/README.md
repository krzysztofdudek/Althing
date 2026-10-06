# Yggdrasil 6.1.0: language grammars and relation coverage

**Question:** Are Yggdrasil's language grammars current, and does relation extraction hold outside its catalogued palette?

**Method:** Grammar packages compared with npm and upstream releases and loaded at their ABI; relation extraction probed per language on shapes outside the palette, with findings verified.

**Status:** concluded

**Conclusion:** No grammar is behind npm and none has an ABI problem, but several are stale upstream; outside the palette there are false edges and structural recall holes in the layouts real monorepos use: 5 blockers, 22 majors, 34 minors.

## What is here

- [report.md](report.md): the verdict, grammar freshness and relation findings
- [findings.json](findings.json): every verified finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path.
