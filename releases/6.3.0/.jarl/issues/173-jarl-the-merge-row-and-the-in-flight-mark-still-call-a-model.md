# 173 · Jarl: the merge row and the in-flight mark still call a model-refused approve approved and queued for the merge

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-169-sonnet
**Where:** skills/jarl/scripts/lib/ball.mjs (the merge row) and lib/loop.mjs (the in-flight mark)
**Branch:** jarl/173-views-and-refusals
**Worker:** w-jarl-173-opus
**Worktree:** /home/me/Worktrees/JarlSkill/173-views-and-refusals
**Since:** 2026-11-08 10:11

## What
After 170 the merge queue lists a branch whose approve the reviewer rule refuses for its model as waiting, but the merge row and the in-flight mark still print approved, not merged, merge it and queued for the merge.

## Why
Every view should say the same about whether the gate will accept the approve.

## Acceptance
The merge row and the in-flight mark use the same reading of the model gate as the queue and done, name what is missing, and a test holds each for both rules

## Evidence

