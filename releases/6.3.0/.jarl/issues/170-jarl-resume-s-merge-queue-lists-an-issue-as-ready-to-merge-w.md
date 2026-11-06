# 170 · Jarl: resume's merge queue lists an issue as ready to merge when done will refuse its approve for the model

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-004-opus-a2
**Where:** skills/jarl/scripts/lib/loop.mjs: the queue builder

## What
Under the other-model or model-rank reviewer rule, an issue whose only approve the model gate refuses is shown as approved and ready to merge.

## Why
The queue should only offer what the gate will accept.

## Acceptance
An issue whose approve the model gate refuses is not listed as ready, and says what is missing, with a test for each rule

## Evidence

