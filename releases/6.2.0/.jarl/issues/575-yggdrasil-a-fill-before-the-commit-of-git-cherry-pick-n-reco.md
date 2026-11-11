# 575 · Yggdrasil: a fill before the commit of git cherry-pick -n records a branch entry as the baseline an…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1312-inbl
**Tags:** 
**Files:** Yggdrasil/docs/the-lock.md
**Repo:** Yggdrasil
**Found by:** rev-302-fable
**Where:** the review of 302, 303, 304
**Branch:** jarl/302-log-merge-integrity
**Worker:** w-302-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 13:12

## What
Yggdrasil: a fill before the commit of git cherry-pick -n records a branch entry as the baseline and the committed pick reads green. It is the gap 303 closed for a squash and for merge --no-commit, and git leaves no state to read it from. CHANGELOG.md and docs/the-lock.md do not name it among the remaining limits. Tags: yggdrasil, log.

## Why


## Acceptance


[read] docs/the-lock.md and the CHANGELOG name a fill before the commit of git cherry-pick -n as a limit beside the date-keeping rebase, since git leaves no state to detect it

## Evidence

### Notes

Assumed: named in docs/the-lock.md (the remaining limits after a date-keeping rebase) and in the CHANGELOG entry for 303, in b69103594; git leaves no state for cherry-pick -n, so the advice is to write the entry yourself.

