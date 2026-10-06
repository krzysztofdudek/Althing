# 147 · Grain: a move made with mv in Bash to follow a placement suggestion is never seen, and the suggestion expires as 'deviated'

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Tags:** grain, hooks, 6.2
**Files:** Grain/plugins/grain/hooks/placement-feedback.mjs
**Repo:** ../../../Grain
**After:** 121
**Found by:** grain-057
**Where:**
**Branch:** jarl/228-hooks-refresh
**Worker:** grain-228
**Worktree:** /Users/me/.jarl-wt/Grain-228
**Since:** 2026-10-05 16:22

## What
After 121 a suggestion is 'followed' when the next Write lands in the suggested directory. An agent that moves a file with mv in Bash does not call Write, so the suggestion expires as 'deviated'. The worker proposes checking the disk on expiry (the misplaced file is gone and a file with that name is in the suggested directory → followed).

## Why
It understates how effective the suggestions are; this is an extension of behaviour, not a defect fix (patch-scope), so it goes to 6.2.

## Acceptance
On expiry the state of the disk is checked and a move counts as followed; a test.

## Evidence


