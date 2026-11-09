# 234 · Althing: ws status reads the release branch of a repository, not the driver's checkout

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261109T0954-gzgu
**Tags:** 
**Files:** 
**Found by:** jarl
**Where:**

## What
The row of a repository whose source is the driver's checkout reports the driver's commit, branch and changelog, so the status of the release is wrong.

## Why
ws status prints the Jarl row as off its declared branch with no changelog entries, because the jarl source now points at the pinned driver.

## Acceptance
- [test] ws status reports a repository at its release branch, from a checkout on it, also when the source the manifest names for the driver is a separate one
- [check] the workspace's tests pass · by: npm test

## Evidence

