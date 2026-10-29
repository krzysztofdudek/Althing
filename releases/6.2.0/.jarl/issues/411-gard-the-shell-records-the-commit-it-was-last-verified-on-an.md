# 411 · Gard: the shell records the commit it was last verified on, and gard drift reports what moved

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, drift
**Files:** Gard/src/drift/verified.mjs, Gard/src/drift/report.mjs, Gard/test/drift.test.mjs
**Repo:** ../../../Gard
**After:** 391
**Found by:** owner
**Where:** the owner, 2026-10-29: the rig's code and the production code have to be developed side by side because both evolve; research/2026-10-29-mimir-and-gard/gard-design.md, section The rig and the code together

## What
After gard check passes for a repo's commit, Gard records that commit as the one the rig was last verified on. gard drift lists every repo whose main branch moved past it, with the number of commits, and runs the checks on request. It reports and never blocks.

## Why
A rig nobody keeps up with rots without a sound; the user must see when the code moved on and whether the environment still holds.

## Acceptance
A test passes check, commits twice in a repo, and sees drift report two commits; check on the new commit clears it

## Evidence

