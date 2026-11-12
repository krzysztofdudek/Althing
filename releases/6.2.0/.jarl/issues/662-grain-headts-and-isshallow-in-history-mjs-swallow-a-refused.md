# 662 · Grain: headTs and isShallow in history.mjs swallow a refused git start the way headSha did

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T2116-ckqx
**Tags:** grain
**Files:** 
**Repo:** Grain
**After:** 557
**Found by:** jarl
**Where:** w-557-sonnet, the Grain rest package
**Branch:** jarl/662-grain-small
**Worker:** w-662-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
A refused git start must stop with the limit message (606, 652); these two answer as if the repository had no time or were not shallow.

## Acceptance
[test] headTs and isShallow stop with the open-files message when git cannot start, red before and green after · by: cd plugins/grain && npm test

## Changelog
- When git cannot start for want of open files, grain now stops and says so instead of continuing as if the repository had no commit time or were not shallow; a content rule written with its content before its path reads only the files the path admits.

## Evidence

### Proof

- **ran (line 0be835d5802c):** node --import ./tests/git-env.mjs --test tests/head-time-shallow-refused-git-start.test.mjs (red before the fix: 2 fail; green after) · **saw:** 5 pass; and cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test: 2405 tests, 2399 pass, 0 fail, 6 skipped for the platform

