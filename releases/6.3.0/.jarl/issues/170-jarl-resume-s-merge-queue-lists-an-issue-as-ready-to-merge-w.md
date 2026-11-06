# 170 · Jarl: resume's merge queue lists an issue as ready to merge when done will refuse its approve for the model

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-004-opus-a2
**Where:** skills/jarl/scripts/lib/loop.mjs: the queue builder
**Branch:** jarl/169-review-gate-bugs
**Merged:** 969f84bc4dcd34903807abe5e9ac3814dcc2ec1c in ../../../JarlSkill
**CI:** none

## What
Under the other-model or model-rank reviewer rule, an issue whose only approve the model gate refuses is shown as approved and ready to merge.

## Why
The queue should only offer what the gate will accept.

## Acceptance
An issue whose approve the model gate refuses is not listed as ready, and says what is missing, with a test for each rule

## Changelog
- Fixed: the merge queue lists a task whose review the loop's reviewer rule will not accept for its model as waiting, with what is missing, until a review that meets the rule is given.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/queue-model-gate.test.mjs (queue code reverted, the new tests in place) · **saw:** pass 1, fail 2: under other-model and model-rank the branch whose approve names no model, or the worker's model, or a lower rank, is ready
- **ran:** cd skills/jarl/scripts && node --test tests/queue-model-gate.test.mjs tests/queue-views.test.mjs tests/docs-true.test.mjs tests/modules.test.mjs tests/resume.test.mjs · **saw:** pass 46, fail 0; queue-model-gate alone pass 3: the refused branches are waiting with the gate's reason, the accepted one and the waived one are ready, the default rule holds nothing back
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip, all four issues committed) · **saw:** tests 1382, pass 1360, fail 0, skipped 22 (a first run failed only the timing test of resume under a machine load of 27, which passes alone; this is the clean rerun)
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; then node --test tests/refusals-walk-reviewers-a.test.mjs alone for the one failure · **saw:** tests 1382, pass 1359, fail 1 (ENOSPC on the shared temp filesystem while another suite ran), skipped 22; the failed file alone: pass 1 of 1; merge 969f84b

