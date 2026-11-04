# 124 · Jarl: round --findings takes a count, not text, against the rule that free text is named text

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-096-opus
**Where:** Found by the worker of 096

## What
The round command's --findings flag takes a number of findings, while every other command names free text text and keeps it last; one flag name now means two things.

## Why
One meaning per flag is the point of the normalized surface; an agent that guesses the free-text meaning is refused.

## Acceptance
The count has a name of its own that is not findings, or is dropped, round refuses the old flag with a ready command, and the command-table test over flag meanings holds

## Evidence

