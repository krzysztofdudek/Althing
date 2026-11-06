# 150 · Jarl: the CHANGELOG still names Horde in its preamble and in two Unreleased entries, which would ship in the 6.3.0 notes

**Status:** in-progress
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-125-opus
**Where:** Review of 125 (rev-jarl-125-opus), Outside the issue
**Branch:** jarl/136-docs-and-horde-words
**Worker:** w-jarl-136-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/136-docs-and-horde-words
**Since:** 2026-11-06 18:35

## What
CHANGELOG.md line 5 lists Horde in the core in the present tense (on main as well), and the Unreleased entries at lines 19 and 41 name it. Horde left the family on 2026-11-04. Issue 125 leaves the CHANGELOG untouched because it is history.

## Why
The notes of 6.3.0 are written once by hand at the release; a present-tense line about a tool that left is wrong on the day it ships.

## Acceptance
The preamble and the two Unreleased entries say nothing of Horde as a present tool; entries of released versions keep their history; the release step's final text is checked for it

## Evidence

- **ran:** node --test tests/docs-true.test.mjs (with the changelog test added, before the edit) · **saw:** pass 27, fail 1: the preamble and two Unreleased entries matched the name of the tool that left
- **ran:** node --test tests/docs-true.test.mjs tests/tense.test.mjs tests/seams.test.mjs (after the edit) · **saw:** pass 48, fail 0
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip) · **saw:** tests 1372, pass 1350, fail 0, skipped 22

