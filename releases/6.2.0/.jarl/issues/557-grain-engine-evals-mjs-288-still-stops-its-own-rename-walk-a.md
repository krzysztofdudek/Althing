# 557 · Grain: engine/evals.mjs:288 still stops its own rename walk after 64 steps without saying so, the k…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1146-izdp
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-182-fable
**Where:** the review of 182, 217
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
Grain: engine/evals.mjs:288 still stops its own rename walk after 64 steps without saying so, the kind of silent cut-off issue 217 removed from the three other resolvers; it should follow a chain to its end as they do (followRenames in engine/lineage.mjs), with a test

## Why


## Acceptance


[test] engine/evals.mjs follows a rename chain to its end as followRenames does, with no silent cut-off at 64 steps, red before and green after · by: cd plugins/grain && npm test

## Evidence

