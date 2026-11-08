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

## Changelog
- Fixed: The check of a worker's branch, the list of branches and the merge queue now measure the work against a repository's declared base branch too. Before, they used the branch the main checkout had open, so a branch merged only there could look finished.

## Evidence

- **ran:** node --test tests/merge-before-done.test.mjs (two new cases, on b3104b1's code) · **saw:** 2 fail: next --as jarl said 'merged; close it' for a merge whose branch has a later commit and for one a red round spent, which done refuses
- **ran:** node --test tests/merge-holds.test.mjs (new case, on b3104b1's code) · **saw:** 1 fail: with base tool release declared, scope read base main (commits beyond base not ok), branches ahead 0, the merge queue base main and no row
- **ran:** node --test tests/merge-holds.test.mjs tests/merge-before-done.test.mjs tests/queue-views.test.mjs tests/next-as.test.mjs tests/next-views.test.mjs tests/ids.test.mjs (at 6e49cdb) · **saw:** 104 pass, 0 fail: the row says 'approved, and the branch has commits after its last merge; merge it again and record the merge' with the merged form, resume's step says the merger lands it again; scope, branches and the queue read release
- **ran:** every read view (resume, status, next, next --all, next --as jarl and owner, list, list --all, decisions, decisions --live, report, sources, branches, models, profile, verify, goal, status and resume --as jarl, and show, show --full, brief and brief --role reviewer of each of the 205 issues), text and --json, base b3104b1 against tip 59132f7 on a copy of the 6.3.0 loop with its repositories linked · **saw:** 1680 calls, 1676 identical; the 4 others (resume, status and both --as jarl, in --json) differ only in ageMs; closedGate holds only 028

