# 195 · Jarl: next --as jarl and the scope, branches and queue views still disagree with the merge check about the base and the merged state

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-163-opus-i1
**Where:** lib/loop.mjs inFlightMark near line 748; lib/rounds.mjs near lines 236, 264, 514; lib/queue.mjs near line 47
**Branch:** jarl/194-small-views-and-refusals
**Worker:** w-jarl-194-opus
**Worktree:** /home/me/Worktrees/JarlSkill/194-small-views-and-refusals
**Since:** 2026-11-08 14:42

## What
next --as jarl says merged; close it, with the done form, for an issue that done now refuses because its merge no longer covers the branch tip. scope, branches and the merge queue of resume still read the branch the main checkout has open, not the declared base that the merge note, the cleanup and the done gate now read.

## Why
Every view should say what the gate will accept.

## Acceptance
The in-flight mark says the merge must be recorded again when done would refuse the merge; scope, branches and the queue read the one base (baseOf); a test holds each

## Evidence

