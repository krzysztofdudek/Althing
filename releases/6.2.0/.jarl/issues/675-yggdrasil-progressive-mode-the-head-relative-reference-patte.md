# 675 · Yggdrasil progressive mode: the HEAD-relative reference pattern (source/cli/src/core/progressive-sc…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2314-nvlk
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-226-opus
**Where:** the review of 226, 243, 267, 344, 345, 598, 599
**Branch:** jarl/226-yggdrasil-rest
**Worker:** w-226-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 23:14

## What
Yggdrasil progressive mode: the HEAD-relative reference pattern (source/cli/src/core/progressive-scope-resolve.ts:449) misses reflog forms such as HEAD@{0} and @{0}; a reference so written, committed or from --reference/YG_PROGRESSIVE_REFERENCE, measures the branch against itself and passes quietly instead of being refused like HEAD.

## Why


## Acceptance


[test] A progressive reference given as a reflog form of HEAD (HEAD@{0}, @{0}) is refused like HEAD and @, so a branch is never measured against itself, red before and green after · by: cd source/cli && npm test

## Evidence

