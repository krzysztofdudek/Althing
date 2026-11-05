# 151 · Jarl: CLAUDE.md calls record.mjs the jarl-record/1 contract while RECORD_API is jarl-record/2, and a few test comments and the skill's composer sentence keep Horde's words

**Status:** open
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-125-opus
**Where:** Review of 125 (rev-jarl-125-opus), Outside the issue

## What
CLAUDE.md:7 names the jarl-record/1 contract; RECORD_API is jarl-record/2 and RECORD_APIS keeps /1 (before 125). Test comments and names such as tests/lifecycle-guard.test.mjs:1 ('its mission') and tests/one-store.test.mjs:411 keep the words mission and ticket. SKILL.md:10 explains a composer in passing while references/glossary.md is meant to hold the one definition, and the vocabulary test's definition pattern does not catch that form. tests/next-as.test.mjs:222 reads 'A composer's profile as a composer ships it'.

## Why
One home per fact: the contract version and the composer definition each live in one place.

## Acceptance
CLAUDE.md names the contract that RECORD_API holds, the leftover mission and ticket words are reworded, SKILL.md points to the glossary instead of defining composer, and the vocabulary test catches the form it missed

## Evidence

