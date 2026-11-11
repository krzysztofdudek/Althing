# 670 · Yggdrasil: SIGHUP during a fill does not flush the verdicts already finished, because the atomic-write handler covers only SIGINT and SIGTERM

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2229-nacg
**Tags:** yggdrasil, reviewers
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** w-641-sonnet, keys rest package report
**Branch:** jarl/641-keys-rest
**Worker:** w-641-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 22:29

## What


## Why
647 made SIGHUP (a closed terminal, a dropped SSH session) end a review like SIGTERM; paid verdicts finished before it are then lost, unlike on SIGINT and SIGTERM.

## Acceptance
[test] SIGHUP during yg check --approve keeps every verdict finished before it, as SIGINT and SIGTERM do, red before and green after · by: cd source/cli && npm test

## Changelog
- A fill that is hung up on (a closed terminal, a dropped SSH session) writes the verdicts it has finished before it ends, as it does for Ctrl+C and SIGTERM.

## Evidence

### Proof

- **ran (line ac1321877c0e):** cd source/cli && npx vitest run tests/e2e/cli-reviewer-fill-runtime.test.ts · **saw:** SIGHUP mid-fill kept the finished verdict only after the change (failed before: no verdict saved); SIGINT passes both ways; 19 of 19 pass

### Notes

Assumed: the comments naming SIGINT/SIGTERM in lock-store.ts, fill-writer.ts and fill-event.ts were left alone, because editing them re-opens node-wide reviewer pairs for no change of behaviour.

