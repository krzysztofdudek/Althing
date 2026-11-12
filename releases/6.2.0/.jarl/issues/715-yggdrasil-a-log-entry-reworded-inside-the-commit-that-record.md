# 715 · Yggdrasil: a log entry reworded inside the commit that recorded it passes yg check after a merge, o…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0406-yczz
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-574h-opus
**Where:** the review of 302, 303, 304, 574, 575

## What
Yggdrasil: a log entry reworded inside the commit that recorded it passes yg check after a merge, or after a rebase the installed merge drivers settle without stopping, with a branch that also moved the log: the lock merge driver keeps the merge base's baseline when both sides moved it, so the first form is held nowhere. Reproduced on release/6.2.0 (d2cc7b6af) and on jarl/302-log-merge-integrity d9b4c8ecf.

## Why


## Acceptance


## Evidence

