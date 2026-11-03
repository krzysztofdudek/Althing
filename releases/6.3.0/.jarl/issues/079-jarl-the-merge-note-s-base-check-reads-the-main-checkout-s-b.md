# 079 · Jarl: the merge note's base check reads the main checkout's branch, not the declared base, and calls a squash merge a merge without the branch

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 009
**Found by:** rev-jarl-009-opus
**Where:** Review of 009 (2026-11-03): the note compares with whatever branch the main checkout has checked out and ignores repo --base; in this loop the main checkout is on main, 16 commits behind release/6.2.1

## What
MERGE WITHOUT THE BASE never fires when the main checkout sits on an older branch, and would fire on every merge once that branch gains a commit the release branch lacks. A squash or rebase merge always draws MERGE WITHOUT THE BRANCH, whose text overstates it. The CHANGELOG implies the declared base is read. When an issue closes without a check, the waiting-for-check mark clears silently.

## Why
A note that cannot fire, or fires on every merge, teaches the coordinator to ignore it.

## Acceptance
- The base check reads the repository's declared base (repo --base) and falls back to the release branch the manifest or goal names, with tests for a main checkout on another branch
- A squash or rebase merge is named as such, not as a merge without the branch, with a test
- The CHANGELOG says what is read, and status says when an issue closed with no check

## Evidence

