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

## Changelog
- Fixed: grain selftest --where follows a file renamed more than 64 times to its end, instead of stopping at 64 steps without saying so.

## Evidence

### Proof

- **ran (line e8b2d0238f19):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/where-eval-rename-chain-no-cap.test.mjs tests/where-eval.test.mjs tests/where-eval-symbol-stratum.test.mjs (before the fix the 65- and 200-step chains failed with 0 !== 1) · **saw:** tests 22, pass 22, fail 0 after the fix

