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

## Evidence

