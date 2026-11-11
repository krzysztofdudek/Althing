# 558 · Grain: tests/build-coordination.test.mjs (:64, :171) and tests/orphan-child.test.mjs (:38) put a st…

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1146-eckq
**Tags:** 
**Files:** 
**Repo:** ../../../Grain
**Found by:** rev-182-fable
**Where:** the review of 182, 217

## What
Grain: tests/build-coordination.test.mjs (:64, :171) and tests/orphan-child.test.mjs (:38) put a stand-in git first on PATH that hands over to the git that command -v finds; where that git is itself a wrapper that calls the first other git on PATH, the two call each other without end, so five tests fail on their premise and leave a process spinning at a full core (seen for 16 minutes before it was stopped); the stand-in should hand over to a git that is not found through PATH again, or the tests should refuse to start there

## Why


## Acceptance


## Evidence

### Notes

Dropped: The same cause as 554, fixed there for build-coordination and orphan-child too (tests/real-git.mjs), now merged on Grain release/6.2.0.

