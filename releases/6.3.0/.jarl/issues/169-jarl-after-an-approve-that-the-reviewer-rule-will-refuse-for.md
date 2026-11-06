# 169 · Jarl: after an approve that the reviewer rule will refuse for its model, the reply still points to set done

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-004-opus-a2
**Where:** skills/jarl/scripts/lib/review.mjs: nextAfterVerdict

## What
Under the other-model or model-rank reviewer rule, an approve given without a model, or with the worker's own model, is refused by done, yet the line after the approve tells the coordinator to run set done.

## Why
The next step the tool names should be one that works.

## Acceptance
The line after such an approve names the review form that carries the model, and a test holds it for each rule

## Evidence

