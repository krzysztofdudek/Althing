# Yggdrasil 6.1.0: CLI communication and the UX system

**Question:** Does the Yggdrasil CLI communicate as one system, to people at a terminal and to agents in a pipe?

**Method:** Every output mode of the 6.1.0 CLI run on fixtures, on a full clone of the Yggdrasil repository at scale and on a real canon-check refusal in a private repository, with the rendering code read alongside; findings verified.

**Status:** concluded

**Conclusion:** What it says is mostly right, but how it says it has no system behind it: there is no output layer, so layouts, the next step and the volume rule vary by command, and agents in a pipe get the longest output.

## What is here

- [report.md](report.md): the verdict, cross-cutting themes and findings
- [findings.json](findings.json): every verified finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. The private repository it observed a refusal in is not named.
