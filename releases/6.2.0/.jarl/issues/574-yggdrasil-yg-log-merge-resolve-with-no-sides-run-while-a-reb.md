# 574 · Yggdrasil: yg log merge-resolve with no sides, run while a rebase or a cherry-pick is stopped on a …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1312-tzye
**Tags:** 
**Files:** Yggdrasil/source/cli/src/core/log/log-merge-resolve.ts
**Repo:** Yggdrasil
**Found by:** rev-302-fable
**Where:** the review of 302, 303, 304
**Branch:** jarl/302-log-merge-integrity
**Worker:** w-302-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 13:12

## What
Yggdrasil: yg log merge-resolve with no sides, run while a rebase or a cherry-pick is stopped on a conflict, records a baseline over a committed rewrite of the first entry (source/cli/src/core/log/log-merge-resolve.ts:933 resolveReplay, the write at :995). Repro: commit a rewrite of the first entry on main, rebase a branch onto it so that it stops on a conflict in another file, run yg log merge-resolve --node app (exit 0, Log baseline updated), git rebase --continue, and yg check passes. With a cherry-pick stopped the same way and then aborted, the moved baseline stays in the working tree and yg check passes too. The release build does the same; the recorded-history guard of 302 does not reach this path. Tags: yggdrasil, log, security.

## Why


## Acceptance


[test] With a rebase or cherry-pick stopped on a conflict, yg log merge-resolve --node <node> with no sides refuses to record a baseline over a committed rewrite of the first entry, and yg check stays red after git rebase --continue, red before and green after · by: cd source/cli && npm test

## Evidence

