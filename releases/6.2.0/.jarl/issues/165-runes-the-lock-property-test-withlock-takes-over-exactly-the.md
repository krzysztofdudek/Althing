# 165 · Runes: the lock property test (withLock takes over exactly the locks…) fails under heavy load — a young lock ages during the waits

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Tags:** runes, flaky
**Files:** Runes/test/properties.test.mjs
**Repo:** ../../../Runes
**Found by:** runes-merger
**Where:**
**Branch:** jarl/165-small-followups
**Merged:** 0861bd7 in ../../../Runes
**CI:** none

## What
In test/properties.test.mjs the withLockAsync test sometimes does not reject a young lock: at a load average of ~108 a lock deemed young exceeds the age limit during the test's waits. The test alone passes 3/3; the full gate failed once.

## Why
A flaky gate in CI teaches people to ignore red.

## Acceptance
The test does not depend on wall-clock time between steps (an injected clock or a margin computed from the limit); it passes under an artificial slowdown.

## Evidence

- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1628, pass 1628, fail 0, catalogue 492 cases, dist/ is fresh; npm run coverage: tests 1628, pass 1628, fail 0, all files 98.76 / 94.12 / 98.64, exit 0; merge 0861bd7 (clean merge, branch based on the release tip; 492 = 487 + 5 matches the cases on disk)

