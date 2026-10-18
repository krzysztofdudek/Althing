# The family release 6.1.0: a dry run

**Question:** Can the family release 6.1.0 run today, and what has to happen first, in which order?

**Method:** A read-only audit merging three angles (the core publish, the add-ons and the canon, the procedure), with the main claims re-checked against the remotes at the time of writing.

**Status:** concluded

**Conclusion:** It could not run that day: Horde CI was red on the release tip and two repositories' canon work was uncommitted; the report gives an ordered checklist per repository and 24 gaps, several of which corrected the releasing procedure.

## What is here

- [report.md](report.md): the verdict, the ordered checklist and the gaps
- [findings.json](findings.json): an empty list: the gaps are in the report's table

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path. The website's repository is private and is not named; it appears as the website's worktree.
