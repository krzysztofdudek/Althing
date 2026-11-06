# 016 · Jarl: the note on an approve says plainly whether done will accept it, and done shows the acceptance lines no row speaks to

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/004-gate-and-ratify
**Merged:** 8235dafa695a100d2dca5e01937886776d0ab635 in ../../../JarlSkill
**CI:** none

## What
Two field reports disagree on the same rule. In one, done refused a coordinator's approve. In the other, a note on a same-model approve said the clearing approve should come from a different model, three reviewers reported the issue could not close, and set done accepted it at once; an approve by reviewers ranked below the worker carried a warning, and done accepted that too, on an issue with an acceptance line that had no evidence at all. The owner's rule is now that a reviewer is a different agent, not a different model.

## Why
A note that reads as a gate but is not one is worse than either: reviewers stop work that could close, and the coordinator learns to ignore the warning that matters.

## Acceptance
- The note on an approve states which approves done accepts in this loop and why, as advice or as a gate, never both
- The model rule follows the loop's profile; its default is a separate agent, which matches the owner's rule
- done lists each acceptance line with no Proof row that names it, and asks for a reason to close without one
- Tests for each

## Changelog
- Changed: Which reviews can close a task is set by the loop. By default any reviewer who is not the task's worker counts, whatever model it runs on, and the message after a review says plainly whether the task can now be closed. A loop can ask instead for a reviewer on another model than the worker's, or on one at least as strong, and then a review that does not meet it, or that does not say which model gave it, cannot close the task.

## Evidence

- **ran:** node --test tests/reviewer-rule.test.mjs, run in a copy of the release tip's scripts (before the change) · **saw:** pass 0, fail 4: the default approve note does not say advice or gate, other-model and model-rank are not profile values (the profile is refused), done accepts a same-model approve
- **ran:** node --test tests/reviewer-rule.test.mjs tests/identical-output.test.mjs tests/models.test.mjs tests/models-loops.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/profile.test.mjs tests/profile-keys.test.mjs tests/record-contract.test.mjs tests/fresh-review.test.mjs tests/surface.test.mjs tests/help-workflow.test.mjs tests/lone-agent-review.test.mjs tests/printed-texts.test.mjs tests/gate-window.test.mjs tests/retract.test.mjs (branch, after the change) · **saw:** pass 249, fail 0
- **ran:** node --test tests/reviewer-rule.test.mjs with the new cases, on the branch at d31be29 (before the fix) · **saw:** tests 8, pass 4, fail 4: under other-model and under model-rank, set 3 done closed an issue whose lease names no model on an approve given without --model (expected a refusal, got exit 0); the approve on such an issue with a model got no note saying done accepts it; the model gate's refusal ended with the review form without --model
- **ran:** node --test tests/reviewer-rule.test.mjs, then with models, models-loops, docs-true, tense, printed-texts, refusals, review-waiver, identical-output, fresh-review, words and vocabulary (branch at 011bc4c, after the fix) · **saw:** reviewer-rule: tests 8, pass 8, fail 0; with the others: tests 172, pass 170, fail 0. Done refuses an approve without --model under other-model and model-rank whatever the lease names, its refusal ends with the review form with --model, the note says so, and models.md and profile.md say the same
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs at the branch tip 7e674a6 · **saw:** tests 1295, pass 1273, fail 0, skipped 22
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch with packages A, B and C, TMPDIR from mktemp -d; two import lines conflicted with B and kept the names of both sides · **saw:** tests 1369, pass 1347, fail 0, skipped 22, merge 8235daf

