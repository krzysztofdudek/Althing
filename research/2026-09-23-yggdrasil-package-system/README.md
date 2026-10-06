# Yggdrasil 6.1.0: the package system

**Question:** Does Yggdrasil's package system (marketplaces, `yg pack`, adapt files) hold beyond the one-package, one-source, repository-root path?

**Method:** Packages installed from local paths, pinned versions and git URLs in scratch projects, with attach, check, update and remove exercised and the code read; findings verified.

**Status:** concluded

**Conclusion:** The copy-and-adapt core holds, but beyond its happy path there is data loss (`yg pack remove` can delete the repository), stale gate results, an unimplemented version model and misleading commands; all of it already affected 6.0.0.

## What is here

- [report.md](report.md): the verdict, themes and findings
- [findings.json](findings.json): every verified finding

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. File-scheme URLs to scratch marketplaces in the evidence are described in words.
