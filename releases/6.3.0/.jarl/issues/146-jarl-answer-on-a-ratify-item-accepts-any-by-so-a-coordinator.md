# 146 · Jarl: answer on a ratify item accepts any --by, so a coordinator can record an item that is the owner's to ratify

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096h-opus
**Where:** Review of 096 (rev-jarl-096h-opus), Outside the issue

## What
answer on an item of kind ratify records the answer whoever --by names; the item is the owner's to ratify (rulings ask-012 and a-013). The behaviour was there before 096; 096 moved the author to --by on every judgement write, which makes the gap visible.

## Why
A ratification the owner did not give must never be recorded as his.

## Acceptance
answer on a ratify item is refused unless --by is owner, and the refusal ends with the form of the ask command, with a test; an answer by a coordinator to an ordinary question is unchanged

## Evidence

