# 146 · Jarl: answer on a ratify item accepts any --by, so a coordinator can record an item that is the owner's to ratify

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096h-opus
**Where:** Review of 096 (rev-jarl-096h-opus), Outside the issue
**Branch:** jarl/004-gate-and-ratify
**Worker:** w-jarl-004-opus
**Worktree:** /Users/me/Worktrees/JarlSkill/004-gate-and-ratify
**Since:** 2026-11-05 13:37

## What
answer on an item of kind ratify records the answer whoever --by names; the item is the owner's to ratify (rulings ask-012 and a-013). The behaviour was there before 096; 096 moved the author to --by on every judgement write, which makes the gap visible.

## Why
A ratification the owner did not give must never be recorded as his.

## Acceptance
answer on a ratify item is refused unless --by is owner, and the refusal ends with the form of the ask command, with a test; an answer by a coordinator to an ordinary question is unchanged

## Changelog
- Fixed: Only the owner can answer an item waiting for his approval. An answer recorded in anyone else's name is refused.

## Evidence

- **ran:** node --test tests/ratify-answer.test.mjs (release tip code, before the change) · **saw:** fail 2 of 3: 'a ratify item is answered only --by owner' fails with AssertionError: expected a refusal: answer a-1 yes --by Jane Doe (the answer was recorded)
- **ran:** node --test tests/ratify-answer.test.mjs tests/ratify-batch.test.mjs tests/jarl.test.mjs tests/skill-shape.test.mjs tests/tense.test.mjs tests/docs-true.test.mjs tests/help-workflow.test.mjs tests/printed-texts.test.mjs (branch, after the change) · **saw:** pass 263, fail 0
- **ran:** on a copy of the loop: ask 'kept the waiver under the mandate' --kind ratify --by jarl, then answer a-16 yes --by w-jarl-004-opus, with the release tip and with the branch · **saw:** release tip: answered a-16, exit 0; branch: a-16 is a ratify item: it is the owner's to ratify or reject, and only his answer is recorded, --by owner (got w-jarl-004-opus), then the form jarl.mjs answer <question> <text> --by <the-owner-himself>, exit 1

