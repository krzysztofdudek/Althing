# 624 · Yggdrasil: a rebase that lands clean onto a branch that commits a rewrite of an entry written after…

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1646-uwfs
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-574c-fable
**Where:** the review of 574, 575

## What
Yggdrasil: a rebase that lands clean onto a branch that commits a rewrite of an entry written after the fork reads green, with no yg log merge-resolve run at all. Repro: topic is cut from main; main adds an entry, fills, then commits a rewrite of that entry's text (yg check: log-integrity); topic adds two commits, each with an entry; git rebase main lands with no stop; yg check reports only log-entry-missing, and after yg log add and yg check --approve it exits 0 with the rewritten entry in the log. The lock driver keeps the oldest of the three baselines, the fork's, and the rewritten log still starts with that history, so what main recorded after the fork is no longer held. With a stop at a later replayed commit, yg log merge-resolve --node app verifies the log and records a baseline over it. Release 6.1.0, the build of 58cef27c1 and the tip 77a0892d6 of jarl/302-log-merge-integrity behave the same. Tags: yggdrasil, log, security.

## Why


## Acceptance


## Evidence

### Notes

Dropped: Ruling yggdrasil-log-removed: Yggdrasil's log is removed, so there is nothing to guard.

