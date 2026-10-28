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

## What
Two field reports disagree on the same rule. In one, done refused a coordinator's approve. In the other, a note on a same-model approve said the clearing approve should come from a different model, three reviewers reported the issue could not close, and set done accepted it at once; an approve by reviewers ranked below the worker carried a warning, and done accepted that too, on an issue with an acceptance line that had no evidence at all. The owner's rule is now that a reviewer is a different agent, not a different model.

## Why
A note that reads as a gate but is not one is worse than either: reviewers stop work that could close, and the coordinator learns to ignore the warning that matters.

## Acceptance
- The note on an approve states which approves done accepts in this loop and why, as advice or as a gate, never both
- The model rule follows the loop's profile; its default is a separate agent, which matches the owner's rule
- done lists each acceptance line with no Proof row that names it, and asks for a reason to close without one
- Tests for each

## Evidence

