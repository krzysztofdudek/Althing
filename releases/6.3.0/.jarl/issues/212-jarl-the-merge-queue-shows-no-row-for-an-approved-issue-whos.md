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

- **ran:** node --test tests/queue-views.test.mjs · **saw:** red before the fix: queue-views tests 8, pass 7, fail 1; the approved branch the base already holds, whose merge a red round spent, has no row in the merge queue (0 rows, expected 1)
- **ran:** node --test tests/queue-views.test.mjs tests/merge-holds.test.mjs tests/queue-model-gate.test.mjs tests/merge-check.test.mjs · **saw:** green after the fix: queue-views tests 8, pass 8, fail 0 (the approved branch the base holds, whose merge a red round spent, has one row marked record only, +0, in resume's merge queue); merge-holds, queue-model-gate and merge-check: 56 tests, 56 pass, 0 fail

