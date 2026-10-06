# Horde smoke check on release/6.1.0

**Question:** Does the rebuilt Horde work as designed on one small real mission, end to end?

**Method:** One small mission on a toy repository with Yggdrasil, Grain and Horde at their release tips, run by a coordinator's worker with nine explicitly pinned agent spawns.

**Status:** concluded

**Conclusion:** It works with issues: every step from init to `done` ran, two workarounds were needed and nine defects were filed (519–527).

## What is here

- [report.md](report.md): the setup, the steps and the defects

## Provenance

Moved into Althing on 2026-10-06 from the private repository the family was run from. Absolute paths became repository-relative or neutral, and references to private records (the 6.1.0 loop, working notes) say what they were without a path.
