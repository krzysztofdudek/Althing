# 173 · Jarl: the merge row and the in-flight mark still call a model-refused approve approved and queued for the merge

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-169-sonnet
**Where:** skills/jarl/scripts/lib/ball.mjs (the merge row) and lib/loop.mjs (the in-flight mark)
**Branch:** jarl/173-views-and-refusals
**Worker:** w-jarl-173-opus
**Worktree:** /home/me/Worktrees/JarlSkill/173-views-and-refusals
**Since:** 2026-11-08 10:11

## What
After 170 the merge queue lists a branch whose approve the reviewer rule refuses for its model as waiting, but the merge row and the in-flight mark still print approved, not merged, merge it and queued for the merge.

## Why
Every view should say the same about whether the gate will accept the approve.

## Acceptance
The merge row and the in-flight mark use the same reading of the model gate as the queue and done, name what is missing, and a test holds each for both rules

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/queue-model-gate.test.mjs, with the new test of the merge row and the in-flight mark under both rules, on the release branch tip a981c80 · **saw:** tests 5, pass 3, fail 2: under other-model and model-rank the next --as row of the issue whose approve the rule refuses for its model is what 'merge' (approved, not merged; merge it) where 'review' is expected
- **ran:** cd skills/jarl/scripts && node --test tests/queue-model-gate.test.mjs at 43d8ae4 and at the tip · **saw:** tests 5, pass 5, fail 0: the refused approve's row is a review row naming what is missing with the review form that carries --model, the in-flight mark is approved-model-refused with the gate's words; an accepted approve still reads merge and approved. the full suite at the branch tip ac6f9bd (cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs) printed tests 1546, pass 1524, fail 0, skipped 22; every view (status, resume, next, next --as jarl and owner, report, models, branches, verify, list, decisions, profile, show, brief, text and --json) on a copy of the loop with the tool repositories linked is the same at a981c80 and at the tip except the ages, and closedGate holds only 028 in both

