# 104 · Jarl: show --json and resume's log tail still carry a retracted note and its reason that a worker's view hides

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 019
**Found by:** rev-jarl-019-opus
**Where:** Review of 019 (2026-11-03): show --json raw evidence text; resume's log tail
**Branch:** jarl/099-views-and-printed-commands
**Worker:** w-jarl-099-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/099-views-and-printed-commands
**Since:** 2026-11-06 20:34

## What
After 019 the worker view of show hides a retracted note and its reason, but show --json still carries them, and resume's log tail prints a note's retraction reason, and workers run resume after a compaction.

## Why
Ruling retracted-note-reason-hidden-from-workers says what a worker reads hides both; two views still show them.

## Acceptance
show --json and resume leave a retracted note and its reason out of what a worker reads, and say how many were retracted, with tests

## Evidence

