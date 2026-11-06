# 169 · Jarl: after an approve that the reviewer rule will refuse for its model, the reply still points to set done

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-004-opus-a2
**Where:** skills/jarl/scripts/lib/review.mjs: nextAfterVerdict
**Branch:** jarl/169-review-gate-bugs
**Merged:** 969f84bc4dcd34903807abe5e9ac3814dcc2ec1c in ../../../JarlSkill
**CI:** none

## What
Under the other-model or model-rank reviewer rule, an approve given without a model, or with the worker's own model, is refused by done, yet the line after the approve tells the coordinator to run set done.

## Why
The next step the tool names should be one that works.

## Acceptance
The line after such an approve names the review form that carries the model, and a test holds it for each rule

## Changelog
- Fixed: after a review that the loop's reviewer rule will not accept for its model, the line that follows gives the review call that names a model, not closing the task.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/reviewer-rule.test.mjs (library code of the issue reverted, the new tests in place) · **saw:** pass 10, fail 4: the four tests for other-model and model-rank fail, the line after an approve with no model or the worker's model points to set done
- **ran:** cd skills/jarl/scripts && node --test tests/reviewer-rule.test.mjs tests/review-waiver.test.mjs tests/docs-true.test.mjs tests/modules.test.mjs tests/seams.test.mjs tests/refusals.test.mjs tests/tense.test.mjs tests/words.test.mjs · **saw:** pass 109, fail 0; reviewer-rule alone pass 14, fail 0: the line names the review form with --model, equal to the form the done refusal ends with, for each rule and for a code issue
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip, all four issues committed) · **saw:** tests 1382, pass 1360, fail 0, skipped 22 (a first run failed only the timing test of resume under a machine load of 27, which passes alone; this is the clean rerun)
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; then node --test tests/refusals-walk-reviewers-a.test.mjs alone for the one failure · **saw:** tests 1382, pass 1359, fail 1 (ENOSPC on the shared temp filesystem while another suite ran), skipped 22; the failed file alone: pass 1 of 1; merge 969f84b

