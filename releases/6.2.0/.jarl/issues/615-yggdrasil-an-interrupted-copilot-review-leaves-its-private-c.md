# 615 · Yggdrasil: an interrupted Copilot review leaves its private configuration folder behind

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1559-nkyl
**Tags:** yggdrasil, reviewers
**Files:** 
**Repo:** Yggdrasil
**After:** 537
**Found by:** jarl
**Where:** w-537-fable, issue 537

## What


## Why
Each interrupted run leaves a folder with a copy of the user's settings; they pile up and the copy outlives the run that needed it.

## Acceptance
[test] A Copilot review interrupted by SIGINT or SIGTERM removes its private folder, as the Claude review does, red before and green after · by: cd source/cli && npm test

## Evidence

