# 625 · Yggdrasil: the reviewer availability check (source/cli/src/utils/binary-check.ts:41, '<cli> --versi…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1657-iajt
**Tags:** 
**Files:** Yggdrasil/source/cli/src/utils/binary-check.ts
**Repo:** Yggdrasil
**Found by:** rev-537-opus
**Where:** the review of 537
**Branch:** jarl/620-keys-and-processes
**Worker:** w-620-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
Yggdrasil: the reviewer availability check (source/cli/src/utils/binary-check.ts:41, '<cli> --version' through execFile with a timeout) sends SIGTERM only, with no SIGKILL escalation, so a CLI that ignores SIGTERM there hangs yg check --approve, yg aspect-test and yg drill before any review, with no message; the review spawn in cli-base escalates for exactly this case

## Why


## Acceptance


[test] A reviewer CLI that ignores SIGTERM when asked for its version is stopped within the availability check's timeout plus a bounded grace and reported as unavailable, so yg check --approve, yg aspect-test and yg drill end with a message instead of hanging, red before (the check never returns) and green after · by: cd source/cli && npm test

## Evidence

