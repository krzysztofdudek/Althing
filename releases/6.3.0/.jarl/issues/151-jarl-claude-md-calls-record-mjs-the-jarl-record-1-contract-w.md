# 151 · Jarl: CLAUDE.md calls record.mjs the jarl-record/1 contract while RECORD_API is jarl-record/2, and a few test comments and the skill's composer sentence keep Horde's words

**Status:** done
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261105T0739-qvyz
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-125-opus
**Where:** Review of 125 (rev-jarl-125-opus), Outside the issue
**Branch:** jarl/136-docs-and-horde-words
**Merged:** 9d9534631f9bdcc954a4e25bc3075fb140d12d31 in ../../../JarlSkill
**CI:** none

## What
CLAUDE.md:7 names the jarl-record/1 contract; RECORD_API is jarl-record/2 and RECORD_APIS keeps /1 (before 125). Test comments and names such as tests/lifecycle-guard.test.mjs:1 ('its mission') and tests/one-store.test.mjs:411 keep the words mission and ticket. SKILL.md:10 explains a composer in passing while references/glossary.md is meant to hold the one definition, and the vocabulary test's definition pattern does not catch that form. tests/next-as.test.mjs:222 reads 'A composer's profile as a composer ships it'.

## Why
One home per fact: the contract version and the composer definition each live in one place.

## Acceptance
CLAUDE.md names the contract that RECORD_API holds, the leftover mission and ticket words are reworded, SKILL.md points to the glossary instead of defining composer, and the vocabulary test catches the form it missed

## Evidence

- **ran (history):** node --test tests/vocabulary.test.mjs (definition pattern widened to the appositive form, before SKILL.md changed) · **saw:** pass 9, fail 1: SKILL.md:10 flagged as defining composer outside the glossary
- **ran (history):** node --test tests/docs-true.test.mjs (CLAUDE.md contract test added, before the edit) · **saw:** pass 28, fail 1: CLAUDE.md named jarl-record/1, RECORD_API is jarl-record/3
- **ran (history):** node --test on the 19 touched and neighbouring test files (vocabulary, docs-true, tense, seams, skill-shape, record-contract and the renamed ones) after the edits · **saw:** pass 454, fail 0, skipped 3
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (branch tip) · **saw:** tests 1372, pass 1350, fail 0, skipped 22
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1385, pass 1363, fail 0, skipped 22, merge 9d95346

