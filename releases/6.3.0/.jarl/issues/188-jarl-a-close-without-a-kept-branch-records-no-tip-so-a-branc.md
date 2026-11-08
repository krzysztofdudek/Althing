# 188 · Jarl: a close without a kept branch records no tip, so a branch of the same name made again later turns a paused-then-closed issue red

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-105-opus-g1
**Where:** skills/jarl/scripts/lib/loop.mjs gateOf and now()
**Branch:** jarl/187-writes-and-gaps
**Worker:** w-jarl-187-opus
**Worktree:** /home/me/Worktrees/JarlSkill/187-writes-and-gaps
**Since:** 2026-11-08 08:13

## What
In the default flow (merged without --keep deletes the branch, then set done) the close records no tip, so a closed issue's gate still reads a live branch first. If a branch of the same name is made again later, a paused-then-closed issue turns red.

## Why
A closed issue's gate must not depend on a branch that may be made again.

## Acceptance
A close in the default flow records the merge sha as its tip, and a test makes the branch again and sees the gate hold

## Evidence

