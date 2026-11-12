# 590 · Yggdrasil: an entry written by hand into the recorded part of a node's log, dated between two recor…

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1417-zvyz
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** rev-302b-fable
**Where:** the review of 302, 303, 304

## What
Yggdrasil: an entry written by hand into the recorded part of a node's log, dated between two recorded entries, and committed, reads clean in yg check, and yg log merge-resolve records a baseline over it after the next merge. The release build does the same. docs/the-lock.md accepts this shape for a merge that brought in an older entry; a hand insertion on one branch has the same shape, and neither the docs nor the CHANGELOG name it as a limit of the append-only check. Tags: yggdrasil, log.

## Why


## Acceptance


## Evidence

### Notes

Dropped: Ruling yggdrasil-log-removed: Yggdrasil's log is removed, so there is nothing to guard.

