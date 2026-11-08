# 211 · Jarl: next --all does not say a question holds the parent itself, because the sub-issue check runs before the question check

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-204-opus-n2
**Where:** lib/evidence.mjs nextRows
**Branch:** jarl/206-queue-and-view-gaps
**Worker:** w-jarl-206-haiku
**Worktree:** /home/me/Worktrees/JarlSkill/206-queue-and-view-gaps
**Since:** 2026-11-08 15:36

## What
A parent with open sub-issues is shown as waiting on them and never as held by its own open stuck or stop question (the sub-issue check runs before the question check in nextRows). The same holds for a parent in the middle of a tree: with 1 over 2 and 2 over 3 and 4, a question on 1 says 'holds up 3, 4' and leaves out 2.

## Why


## Acceptance
next --all and next --as show a parent with an open question on it as held by the question as well as waiting on its sub-issues, also a parent in the middle of a tree, and the holds-up count of the question includes it

## Evidence

- **ran:** node --test tests/sub-issues.test.mjs · **saw:** red before the fix: sub-issues tests 15, pass 14, fail 1; the parent with an open stuck question has one row of next --all, group waiting-sub, and no held-by-question row
- **ran:** node --test tests/sub-issues.test.mjs tests/next-views.test.mjs tests/next-as.test.mjs tests/resume.test.mjs · **saw:** green after the fix: sub-issues tests 15, pass 15, fail 0; the parent with an open stuck question has a waiting-sub row and a held-by-question row, shown under both headers. next-views, next-as and resume: 44 tests, 43 pass, 0 fail, 1 skipped (JARL_LIVE_LOOP is unset)
- **ran:** node --test tests/sub-issues.test.mjs · **saw:** red on the merged tree, before the question rows were combined: sub-issues tests 19, pass 17, fail 2. The parent with an open question shows only as waiting on its sub-issues, both in the parent test and in the new mid-tree test, where issue 1 over issue 2 over issues 3 and 4 has a question on issue 1 (expected both groups for issues 1 and 2, held by the question for 3 and 4)
- **ran:** node --test tests/sub-issues.test.mjs · **saw:** green after the question rows were combined: sub-issues tests 19, pass 19, fail 0. Mid-tree case: issue 1 over issue 2 over issues 3 and 4, a question on issue 1: issues 1 and 2 show under both groups, issues 3 and 4 are held by the question, nothing under it is offered, and the question's holds-up count is 2, 3, 4

