# Windows support across the family

**Question:** Does each family tool work on Windows, and what breaks there?

**Method:** On 2026-09-27, for issue 481, five agents audited Runes, Jarl, Grain, Horde and Yggdrasil; four fixed their tool and added `windows-latest` CI, and the Yggdrasil agent only read the code and proposed fixes.

**Status:** concluded

**Conclusion:** Jarl, Grain and Horde pass on `windows-latest`; Runes' fixes had not yet run on real Windows, and Yggdrasil needed fixes first (broken reviewer arguments, a reviewer timeout that leaves the process running, CRLF grammar checkouts).

## What is here

- [report.md](report.md): the audit, translated from Polish

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. The original was Polish and is not public. Example Windows paths are written with placeholders.
