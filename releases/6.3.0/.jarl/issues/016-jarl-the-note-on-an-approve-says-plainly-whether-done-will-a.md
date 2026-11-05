# 016 · Jarl: the note on an approve says plainly whether done will accept it, and done shows the acceptance lines no row speaks to

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/004-gate-and-ratify
**Worker:** w-jarl-004-opus
**Worktree:** /Users/me/Worktrees/JarlSkill/004-gate-and-ratify
**Since:** 2026-11-05 13:37

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
- Changed: Which reviews can close a task is set by the loop. By default any reviewer who is not the task's worker counts, whatever model it runs on, and the message after a review says plainly whether the task can now be closed. A loop can ask instead for a reviewer on another model than the worker's, or on one at least as strong, and then a review that does not meet it cannot close the task.

## Evidence

- **ran:** node --test tests/reviewer-rule.test.mjs, run in a copy of the release tip's scripts (before the change) · **saw:** pass 0, fail 4: the default approve note does not say advice or gate, other-model and model-rank are not profile values (the profile is refused), done accepts a same-model approve
- **ran:** node --test tests/reviewer-rule.test.mjs tests/identical-output.test.mjs tests/models.test.mjs tests/models-loops.test.mjs tests/docs-true.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/profile.test.mjs tests/profile-keys.test.mjs tests/record-contract.test.mjs tests/fresh-review.test.mjs tests/surface.test.mjs tests/help-workflow.test.mjs tests/lone-agent-review.test.mjs tests/printed-texts.test.mjs tests/gate-window.test.mjs tests/retract.test.mjs (branch, after the change) · **saw:** pass 249, fail 0

