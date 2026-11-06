# 165 · Jarl: a code issue reopened after its merge can close again on the old merge

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-004-opus-a
**Where:** skills/jarl/scripts/lib/loop.mjs: unmergedCode and the status flag count any merge ever recorded

## What
A code issue that is reopened after its merge and gets new commits still counts as merged, so done accepts it on the old merge.

## Why
The done gate and the status flag for a closed issue with no merge should judge the merge of the current code, not any merge ever recorded.

## Acceptance
- A code issue reopened after a merge and given a new commit is refused by done until a merge of the new tip is recorded, with the form of merged
- A test holds it, and an issue merged once and never reopened is unchanged

## Evidence

