# 174 · Jarl: three small gaps in the model gate readings found by the review of group D1

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-169-opus-d1
**Where:** skills/jarl/scripts/lib/base.mjs namesComparison; lib/models.mjs lightMayClear; lib/loop.mjs awaitsMerge
**Branch:** jarl/173-views-and-refusals
**Worker:** w-jarl-173-opus
**Worktree:** /home/me/Worktrees/JarlSkill/173-views-and-refusals
**Since:** 2026-11-08 10:11

## What
(1) The proof-row check for the identical-output tag is a word match: a routine git diff stat row passes and a row saying no differences in output does not. (2) lightMayClear reads every evidence row, including one recorded before a reopen or a round. (3) awaitsMerge also stops the idle mark for an approved issue that carries no code and has nothing to merge, which the docs do not say.

## Why
The tag relaxes a rule, so its evidence should be the evidence for this change; the idle mark should mean what the docs say.

## Acceptance
The comparison row must be recorded after the last reopen or round; the idle mark of an approved issue with no code is decided and documented; a test holds each

## Evidence

