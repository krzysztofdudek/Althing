# 642 · Yggdrasil: a merge of a branch that committed a rewrite of an entry written after the fork is recor…

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1938-leus
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-574d-opus
**Where:** the review of 302, 303, 304

## What
Yggdrasil: a merge of a branch that committed a rewrite of an entry written after the fork is recorded over by yg log merge-resolve itself, and yg check then passes. Repro: topic is cut from main; main adds an entry, fills, then commits a rewrite of that entry's text (yg check: log-integrity); topic adds an entry with its fill; on topic, git merge --no-ff main: the post-merge step prints "Verified .yggdrasil/model/app/log.md; baseline recorded.", yg log merge-resolve --node app exits 0, and after yg log add and yg check --approve, yg check exits 0 with the rewritten entry in the log. The lock driver keeps the merge base's baseline, and the recorded-history guard of 302 holds only the baseline left in the working tree, not the one each side commits, so what main recorded after the fork is not held; at a rebase or cherry-pick stop 574 holds the target's own committed baseline, the merge form does not. The tip of jarl/302-log-merge-integrity (1e58cce99) and release/6.2.0 (03ac2699d) behave the same. Same root as 624 (a rebase that lands clean), which also reaches an amend at a rebase edit pause that rewrites an entry main wrote after the fork, and a stop refused by merge-resolve and continued without it: after the continue yg check reads only log-cycle-open or log-entry-missing. Tags: yggdrasil, log, security.

## Why


## Acceptance


## Evidence

### Notes

Dropped: Ruling yggdrasil-log-removed: Yggdrasil's log is removed, so there is nothing to guard.

