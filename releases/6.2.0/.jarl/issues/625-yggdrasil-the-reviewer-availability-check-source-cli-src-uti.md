# 625 · Yggdrasil: the reviewer availability check (source/cli/src/utils/binary-check.ts:41, '<cli> --versi…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1657-iajt
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-537-opus
**Where:** the review of 537

## What
Yggdrasil: the reviewer availability check (source/cli/src/utils/binary-check.ts:41, '<cli> --version' through execFile with a timeout) sends SIGTERM only, with no SIGKILL escalation, so a CLI that ignores SIGTERM there hangs yg check --approve, yg aspect-test and yg drill before any review, with no message; the review spawn in cli-base escalates for exactly this case

## Why


## Acceptance


## Evidence

