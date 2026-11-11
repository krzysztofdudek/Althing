# 567 · Grain tests on a loaded machine: tests/placement-moves.test.mjs failed 4 of 4 in a full suite run w…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1227-merm
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-169-fable
**Where:** the review of 169
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
Grain tests on a loaded machine: tests/placement-moves.test.mjs failed 4 of 4 in a full suite run with "Security violation: Requested utility `git` does not match executable name" from the coreutils env behind the machine git proxy, and passes when run alone; possibly the same cause as issue 554.

## Why


## Acceptance


[test] tests/placement-moves.test.mjs passes in the full suite on a loaded machine behind the machine's git proxy, or the cause is shown to be gone with 554 and the test passes five full suites in a row · by: cd plugins/grain && npm test

## Evidence

