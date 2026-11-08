# 211 · Jarl: next --all does not say a question holds the parent itself, because the sub-issue check runs before the question check

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-204-opus-n2
**Where:** lib/evidence.mjs nextRows

## What
A parent with open sub-issues is shown as waiting on them and never as held by its own open stuck or stop question.

## Why


## Acceptance
next --all shows a parent with an open question on it as held by the question as well as waiting on its sub-issues

## Evidence

