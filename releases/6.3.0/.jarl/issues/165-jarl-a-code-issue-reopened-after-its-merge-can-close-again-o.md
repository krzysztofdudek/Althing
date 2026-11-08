# 165 · Jarl: a code issue reopened after its merge can close again on the old merge

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-004-opus-a
**Where:** skills/jarl/scripts/lib/loop.mjs: unmergedCode and the status flag count any merge ever recorded
**Branch:** jarl/163-base-and-reopen
**Worker:** w-jarl-163-opus
**Worktree:** /home/me/Worktrees/JarlSkill/163-base-and-reopen
**Since:** 2026-11-08 09:34

## What
A code issue that is reopened after its merge and gets new commits still counts as merged, so done accepts it on the old merge.

## Why
The done gate and the status flag for a closed issue with no merge should judge the merge of the current code, not any merge ever recorded.

## Acceptance
- A code issue reopened after a merge and given a new commit is refused by done until a merge of the new tip is recorded, with the form of merged
- A test holds it, and an issue merged once and never reopened is unchanged

## Changelog
- Fixed: A task with code that is reopened, or sent back by a failed round, after its merge, or that gets new commits after it, can no longer be closed on that old merge: the merger records the merge of the code as it is now first. The status names a finished task that was closed on such a merge. A task merged once and never reopened closes as before.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/merge-before-done.test.mjs (with the library fix taken back) · **saw:** fail 5 of 9: done closed on the old merge an issue reopened with a new commit, one whose branch gained a commit after the merge, one after a red round, and one under a landed-merge profile; status flagged nothing for an issue closed on a merge from before its reopen. The issue merged once and never reopened passed
- **ran:** cd skills/jarl/scripts && node --test tests/merge-before-done.test.mjs; then the closed-gate, gate-window, review-waiver, fresh-approve-stands, merge-check, merge-holds, gate-decide-tips, close-deferred, lifecycle-guard, lease-holds and merge-cleanup tests (after the fix) · **saw:** pass 9, fail 0, and pass 167, fail 0. On a copy of this loop with the tool repositories linked, status, resume, next and report print the same on the release branch and on this branch (ages aside): done 111, closed gate does not hold only 028
- **ran:** cd skills/jarl/scripts && npm test (the whole suite on the branch tip 58824ff) · **saw:** tests 1548, pass 1526, fail 0, skipped 22; the suite left nothing in its temporary directory

