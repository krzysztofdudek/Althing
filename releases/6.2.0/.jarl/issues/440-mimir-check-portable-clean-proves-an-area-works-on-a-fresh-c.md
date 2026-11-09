# 440 · Mimir: check --portable --clean proves an area works on a fresh computer

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261029T1430-hyjo
**Tags:** mimir, workplace, areas, tests
**Files:** Mimir/src/commands/check.mjs, Mimir/src/manifest/portable-clean.mjs, Mimir/templates/area-portable-workflow.yml, Mimir/test/portable-clean.test.mjs
**Repo:** ../../../Mimir
**After:** 426
**Found by:** jarl
**Where:** Mimir at 10257cd has only the static part of check --portable

## What
check --portable --clean clones the area into an empty home (from a local bare origin in tests), runs init --from, doctor, ls and search, and reports each step; a workflow template for an area calls it.

## Why
A shared area must work for a colleague on a fresh computer, not only for its author.

## Acceptance
An area with a local path in its manifest ends NOT_PORTABLE naming the failing step; the caller's home and tree are unchanged; the template parses and is not run in the loop

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

