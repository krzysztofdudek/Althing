# 137 · Jarl: a ratify item answered with words other than yes or reject is recorded as an answer

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096c-opus
**Where:** Review of 096 (rev-jarl-096c-opus), Outside the issue

## What
answer on a ratify item records any text as the answer (lib/questions.mjs), so a ratification can be recorded with words that mean neither yes nor reject. The behaviour was there before 096.

## Why
A ratification is the owner's act; a recorded answer that is neither yes nor reject leaves the item in an unclear state.

## Acceptance
answer on a ratify item accepts yes or reject (and the words the tool documents) and refuses anything else with the usage, with a test

## Evidence

