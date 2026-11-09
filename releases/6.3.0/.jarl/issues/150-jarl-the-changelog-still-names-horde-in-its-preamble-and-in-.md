# 150 · Jarl: the CHANGELOG still names Horde in its preamble and in two Unreleased entries, which would ship in the 6.3.0 notes

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Key:** 20261105T0739-ilzi
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-125-opus
**Where:** Review of 125 (rev-jarl-125-opus), Outside the issue
**Branch:** jarl/136-docs-and-horde-words
**Merged:** 9d9534631f9bdcc954a4e25bc3075fb140d12d31 in ../../../JarlSkill
**CI:** none

## What
CHANGELOG.md line 5 lists Horde in the core in the present tense (on main as well), and the Unreleased entries at lines 19 and 41 name it. Horde left the family on 2026-11-04. Issue 125 leaves the CHANGELOG untouched because it is history.

## Why
The notes of 6.3.0 are written once by hand at the release; a present-tense line about a tool that left is wrong on the day it ships.

## Acceptance
The preamble and the two Unreleased entries say nothing of Horde as a present tool; entries of released versions keep their history; the release step's final text is checked for it

## Evidence

- **ran (history):** node --test tests/docs-true.test.mjs (with the changelog test added, before the edit) · **saw:** pass 27, fail 1: the preamble and two Unreleased entries matched the name of the tool that left
- **ran (history):** node --test tests/docs-true.test.mjs tests/tense.test.mjs tests/seams.test.mjs (after the edit) · **saw:** pass 48, fail 0
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip) · **saw:** tests 1372, pass 1350, fail 0, skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1385, pass 1363, fail 0, skipped 22, merge 9d95346

