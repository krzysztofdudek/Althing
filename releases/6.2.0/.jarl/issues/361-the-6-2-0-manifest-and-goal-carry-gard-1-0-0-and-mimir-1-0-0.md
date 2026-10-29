# 361 · The 6.2.0 manifest and goal carry Gard 1.0.0 and Mimir 1.0.0 with their checks

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** althing, workplace, workspace
**Files:** Althing/releases/6.2.0/family.json, Althing/releases/6.2.0/.jarl/goal.md
**Repo:** ../..
**After:** 359
**Found by:** owner
**Where:** releases/6.2.0/family.json lists runes, yggdrasil, grain, jarl, horde and althing; goal.md has one Check line per repository

## What
The release manifest gains gard (version 1.0.0, branch release/1.0.0, tag v1.0.0, npm @chrisdudek/gard@1.0.0) and mimir (version 1.0.0, branch release/1.0.0, tag v1.0.0, npm @chrisdudek/mimir@1.0.0), each with the check that decides what lands there: for Gard its suite in its own dev container, for Mimir its suite in its dev container (scripts/dx run, then npm test, until Gard runs it). The goal gains the two Check lines and one paragraph citing the ruling that brought the tools in. The branch release/1.0.0 is cut in Gard from its first commit and in Mimir from the tip of its first build branch. Nothing is pushed.

## Why
One check per repository decides what lands, mirrored from the manifest into the goal (ruling goal-check-lines); a repository with no line lands on testimony alone.

## Acceptance
- family.json validates and names gard and mimir with version, branch, tag, npm and check; ws status lists both on release/1.0.0
- goal.md carries a Check line for Gard and for Mimir and the paragraph citing the ruling; ws jarl resume prints them

## Evidence

