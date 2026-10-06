# Yggdrasil 6.1.0: questionable code and architecture

**Question:** Where does the code of the Yggdrasil 6.1.0 CLI hide defects, and does its graph match its code?

**Method:** Four angles (correctness hazards, concurrency and I/O, architecture and design, graph versus code) over `source/cli/src` and `.yggdrasil/` at `007473ad`; each surviving finding re-verified, mostly by re-running the container build in fresh scratch projects.

**Status:** concluded

**Conclusion:** The CLI is layered better than its size suggests, and its own graph passes; the defects sit where the code meets its environment: line endings, concurrency, the file system.

## What is here

- [report.md](report.md): the verdict and findings
- [findings.json](findings.json): every verified finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path.
