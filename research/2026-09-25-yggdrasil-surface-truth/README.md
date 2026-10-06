# Yggdrasil 6.1.0: surface truth

**Question:** Does anything keep Yggdrasil's five surfaces (knowledge topics, docs site, `yg prime`, schemas, `--help`) consistent with each other and with the code?

**Method:** Eight audit areas checked 1,081 claims against the source and against the live 6.1.0 CLI in scratch projects.

**Status:** concluded

**Conclusion:** No: each surface is written by hand and drifts on its own; about 185 distinct defects remained after merging (1 blocker, 30 majors, about 154 minors), and Yggdrasil's `surface-truth` check now guards this.

## What is here

- [report.md](report.md): the verdict and findings
- [findings.json](findings.json): every kept finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. A fake API key in the evidence is shortened so that the secret rail does not read it as a key.
