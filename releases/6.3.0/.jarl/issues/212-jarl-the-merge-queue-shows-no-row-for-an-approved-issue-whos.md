# 212 · Jarl: the merge queue shows no row for an approved issue whose merge a red round spent while its branch is already in the base, though next --as jarl asks the merger to record it again

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-194-opus-n1
**Where:** lib/queue.mjs cmdQueue, if (!ahead) continue
**Branch:** jarl/206-queue-and-view-gaps
**Worker:** w-jarl-206-haiku
**Worktree:** /home/me/Worktrees/JarlSkill/206-queue-and-view-gaps
**Since:** 2026-11-08 15:36

## What
next --as jarl says to merge again and record it, but queue and resume's merge queue have no row for that branch.

## Why


## Acceptance
the merge queue shows a row, marked record only, for an approved issue whose branch is already in the base and whose merge is not recorded now

## Evidence

