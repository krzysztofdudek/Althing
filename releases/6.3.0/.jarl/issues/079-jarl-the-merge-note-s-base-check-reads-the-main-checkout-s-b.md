# 079 · Jarl: the merge note's base check reads the main checkout's branch, not the declared base, and calls a squash merge a merge without the branch

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 009
**Found by:** rev-jarl-009-opus
**Where:** Review of 009 (2026-11-03): the note compares with whatever branch the main checkout has checked out and ignores repo --base; in this loop the main checkout is on main, 16 commits behind release/6.2.1
**Branch:** jarl/074-merge-and-files
**Worker:** w-jarl-074-sonnet
**Worktree:** /Users/me/Worktrees/JarlSkill/074-merge-and-files
**Since:** 2026-11-05 13:37

## What
MERGE WITHOUT THE BASE never fires when the main checkout sits on an older branch, and would fire on every merge once that branch gains a commit the release branch lacks. A squash or rebase merge always draws MERGE WITHOUT THE BRANCH, whose text overstates it. The CHANGELOG implies the declared base is read. When an issue closes without a check, the waiting-for-check mark clears silently.

## Why
A note that cannot fire, or fires on every merge, teaches the coordinator to ignore it.

## Acceptance
- The base check reads the repository's declared base (repo --base) and falls back to the release branch the manifest or goal names, with tests for a main checkout on another branch
- A squash or rebase merge is named as such, not as a merge without the branch, with a test
- The CHANGELOG says what is read, and status says when an issue closed with no check

## Changelog
- Fixed: Recording a merge warns when the commit lacks the latest state of the branch the repository is declared with (and, where none is declared, the one its main checkout has open); a squash or rebase merge is named as such and not as a merge without the branch; a task closed with no check recorded on its merge is named in the status.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/merge-holds.test.mjs, with lib/ at the release tip · **saw:** pass 25, fail 4: the declared-base note fires falsely on a main checkout on main when the result holds release, is silent when release is missing; a squash merge and a rebase merge are called MERGE WITHOUT THE BRANCH
- **ran:** node --test tests/merge-holds.test.mjs, with the closed-with-no-check test and lib/ at the release tip · **saw:** fail 1: status prints no closed-with-no-check line and the JSON has no closedNoCheck
- **ran:** cd skills/jarl/scripts && node --test tests/merge-holds.test.mjs, on the branch · **saw:** pass 30, fail 0 (main checkout on another branch, declared base missing falls back, squash and rebase named, closed with no check named by status and cleared by the check)
- **ran:** node jarl.mjs status --root <copy of the 6.3.0 loop> · **saw:** a line 'closed with no check recorded on the merge: 002 (3113b5f in ../../../JarlSkill), …' listing the closed issues whose merge has no check

