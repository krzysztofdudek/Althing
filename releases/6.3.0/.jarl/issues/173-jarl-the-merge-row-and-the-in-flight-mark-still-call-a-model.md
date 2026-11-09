# 173 · Jarl: the merge row and the in-flight mark still call a model-refused approve approved and queued for the merge

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261106T1856-cpak
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-169-sonnet
**Where:** skills/jarl/scripts/lib/ball.mjs (the merge row) and lib/loop.mjs (the in-flight mark)
**Branch:** jarl/173-views-and-refusals
**Merged:** 0e17fb92e93c4507d564e47f6ebb71403b6a3391 in ../../../JarlSkill
**CI:** none

## What
After 170 the merge queue lists a branch whose approve the reviewer rule refuses for its model as waiting, but the merge row and the in-flight mark still print approved, not merged, merge it and queued for the merge.

## Why
Every view should say the same about whether the gate will accept the approve.

## Acceptance
The merge row and the in-flight mark use the same reading of the model gate as the queue and done, name what is missing, and a test holds each for both rules

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/queue-model-gate.test.mjs, with the new test of the merge row and the in-flight mark under both rules, on the release branch tip a981c80 · **saw:** tests 5, pass 3, fail 2: under other-model and model-rank the next --as row of the issue whose approve the rule refuses for its model is what 'merge' (approved, not merged; merge it) where 'review' is expected
- **ran (history):** cd skills/jarl/scripts && node --test tests/queue-model-gate.test.mjs at 43d8ae4 and at the tip · **saw:** tests 5, pass 5, fail 0: the refused approve's row is a review row naming what is missing with the review form that carries --model, the in-flight mark is approved-model-refused with the gate's words; an accepted approve still reads merge and approved. the full suite at the branch tip ac6f9bd (cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs) printed tests 1546, pass 1524, fail 0, skipped 22; every view (status, resume, next, next --as jarl and owner, report, models, branches, verify, list, decisions, profile, show, brief, text and --json) on a copy of the loop with the tool repositories linked is the same at a981c80 and at the tip except the ages, and closedGate holds only 028 in both
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on five files (import lines of ball, evidence and models, two reference tables), resolved by keeping both sides, holderKey exported from loop.mjs, and a follow-up commit dropped the unused leaseOfMove import the modules test refused · **saw:** first run tests 1583, pass 1560, fail 1 (the imports-only-names-it-uses test); after the follow-up tests 1583, pass 1561, fail 0, skipped 22, tip 0e17fb9

