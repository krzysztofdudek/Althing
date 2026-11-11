# 557 · Grain: engine/evals.mjs:288 still stops its own rename walk after 64 steps without saying so, the k…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1146-izdp
**Tags:** 
**Files:** 
**Repo:** ../../../Grain
**Found by:** rev-182-fable
**Where:** the review of 182, 217

## What
Grain: engine/evals.mjs:288 still stops its own rename walk after 64 steps without saying so, the kind of silent cut-off issue 217 removed from the three other resolvers; it should follow a chain to its end as they do (followRenames in engine/lineage.mjs), with a test

## Why


## Acceptance


## Evidence

