# Yggdrasil 6.1.0: documentation consistency

**Question:** Do Yggdrasil 6.1.0's README, docs, knowledge topics, prime template and `--help` agree with each other and with the code?

**Method:** An audit of every surface against the others and against the code, with findings verified.

**Status:** concluded

**Conclusion:** The mechanical facts hold; the packages docs describe a model the code does not implement, the documented first-run path breaks, and hand-copied facts drift between surfaces. One blocker and four majors survived verification.

## What is here

- [report.md](report.md): the verdict, themes and findings
- [findings.json](findings.json): every verified finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. One issue title quoted from the 6.1.0 loop is translated from Polish.
