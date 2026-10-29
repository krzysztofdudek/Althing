# 383 · Gard: deterministic names of containers, projects, networks and volumes

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, container
**Files:** Gard/src/container/names.mjs, Gard/test/container-names.test.mjs
**Repo:** ../../../Gard
**After:** 375
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section Containers, Names

## What
One function derives every Docker name from the shell's name, the topic, the view and, for a dependency volume, the repo's directory: allowed characters only, lowercase, shortened with a stable hash suffix where Docker's limits would be exceeded. The names never come from a directory name of the computer, so the same shell gives the same names on every computer and every clone.

## Why
Named containers and volumes per repository and per view are what keeps two views, two worktrees and two computers from stepping on each other.

## Acceptance
Tests show the same inputs give the same names, different views give different names, a very long topic stays within the limit with its hash, and two shells cloned into differently named directories give the same names

## Evidence

