# 156 · Jarl: the takeover role is read from the round counter and is wrong twice in this loop's history

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-058b-opus
**Where:** Review of 058 (rev-jarl-058b-opus), Outside the issue

## What
takeoverStanding in lib/rounds.mjs gives issue 055 the takeover role though its three unmarked rounds ended with the same worker and no takeover move, and misses the takeover of 096, which has no round lines. In this loop no rule is scoped to the takeover role, so no brief text changes; only the roles field of brief --json is affected.

## Why
A role read by a counting heuristic can name the wrong role when a rule scoped to it exists.

## Acceptance
The takeover role comes from the recorded takeover move (a lease change to a new worker with a takeover reason), not from counting rounds, and both histories of this loop give the right role; a test holds each

## Evidence

