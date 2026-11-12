# 702 · Yggdrasil: a log entry reworded inside the commit that recorded it (a fixup squashed by git rebase -i, or an amend at an edit pause) passes yg log merge-resolve at a later rebase or cherry-pick stop

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261112T0306-uzhp
**Tags:** yggdrasil, log, security
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** rev-574f-opus, 574 round 6 (log-replay-stop.ts:98-107); ruling log-guard-574-merged-with-known-limits

## What


## Why
The guard of 574 holds what the replay's commits recorded, but a commit whose log does not start with what its own baseline recorded holds nothing, so a rewrite folded into the recording commit reads green when a later rebase stops on a conflict; without a stop the same branch stays red.

## Acceptance
[test] A rewrite of an entry folded into the commit that recorded it, by a fixup squashed before the replay, inside the same rebase -i, or by an amend at an edit pause, is refused at a later stop, while round 1's backport and rebase --onto still reconcile, red before and green after · by: cd source/cli && npm test

## Evidence

### Notes

Deferred: The owner chose to merge 574 with this shape as a known limit (ruling log-guard-574-merged-with-known-limits); it is fixed in the next release.

Dropped: Ruling yggdrasil-log-removed: Yggdrasil's log is removed.

