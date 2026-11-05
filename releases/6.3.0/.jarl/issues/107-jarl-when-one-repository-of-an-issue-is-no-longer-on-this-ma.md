# 107 · Jarl: when one repository of an issue is no longer on this machine, recording another repository's merge gives a false 'approved on another tip' note

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 055
**Found by:** rev-jarl-055d-opus
**Where:** Review of 055 (2026-11-03): merged note, lib/commands.mjs
**Branch:** jarl/074-merge-and-files
**Worker:** w-jarl-074-sonnet
**Worktree:** /Users/me/Worktrees/JarlSkill/074-merge-and-files
**Since:** 2026-11-05 13:37

## What
If one repository of a multi-repository issue is no longer on this machine, recording the merge of another repository gives the note even when nothing moved.

## Why
A note that says a tip moved must be true; a missing repository means the note stays silent for it.

## Acceptance
A repository missing on this machine keeps the note silent for the others, with a test

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/merge-holds.test.mjs, two new tests, lib/ at the commit before the fix · **saw:** pass 30, fail 2: with lib moved away and no tip moved, the merge of tool prints 'APPROVED ON ANOTHER TIP … at ebe15595d304, ebe15595d304, and the branch stands at ebe15595d304'; with tool's branch moved the expected single-repository wording is missing
- **ran:** cd skills/jarl/scripts && node --test tests/merge-holds.test.mjs, on the branch · **saw:** pass 32, fail 0: the note is silent for the unmoved tool and still names the moved tool when lib is away

