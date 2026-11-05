# 137 · Jarl: a ratify item answered with words other than yes or reject is recorded as an answer

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096c-opus
**Where:** Review of 096 (rev-jarl-096c-opus), Outside the issue
**Branch:** jarl/004-gate-and-ratify
**Worker:** w-jarl-004-opus
**Worktree:** /Users/me/Worktrees/JarlSkill/004-gate-and-ratify
**Since:** 2026-11-05 13:37

## What
answer on a ratify item records any text as the answer (lib/questions.mjs), so a ratification can be recorded with words that mean neither yes nor reject. The behaviour was there before 096.

## Why
A ratification is the owner's act; a recorded answer that is neither yes nor reject leaves the item in an unclear state.

## Acceptance
answer on a ratify item accepts yes or reject (and the words the tool documents) and refuses anything else with the usage, with a test

## Changelog
- Fixed: An answer to an item waiting for the owner's approval must start with a word that approves or rejects it, such as yes or reject. Any other answer is refused, so it is always clear what the owner decided.

## Evidence

- **ran:** node --test tests/ratify-answer.test.mjs (release tip code, before the change) · **saw:** the test 'a ratify item with no ruling is answered with the word that ratifies or rejects first' fails: AssertionError: expected a refusal: answer a-1 maybe later --by owner (the answer was recorded)
- **ran:** node --test tests/ratify-answer.test.mjs tests/ratify-batch.test.mjs tests/jarl.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/docs-true.test.mjs tests/help-workflow.test.mjs tests/printed-texts.test.mjs tests/scoped-rules.test.mjs tests/slices.test.mjs tests/library-parity.test.mjs tests/testimony.test.mjs tests/surface.test.mjs tests/owner-quote.test.mjs (branch, after the change) · **saw:** pass 355, fail 0
- **ran:** on a copy of the loop with ratify item a-16 open: answer a-16 'maybe later' --by owner, with the release tip and with the branch · **saw:** release tip: answered a-16, exit 0; branch: a-16 is a ratify item: the answer starts with one word — yes, ok, ratify, ratified, accept, accepted, approve, approved, the Polish word for yes to ratify it, reject, rejected, the Polish word for no to reject it (got maybe later), then the form jarl.mjs answer <question> <yes-or-reject-first> --by <who>, exit 1

