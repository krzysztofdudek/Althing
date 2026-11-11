# 231 · Grain: an ambiguous symbol resolved per graph node, as in yg check (the second half of 117)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1413-fbpi
**Tags:** grain, relations, partial
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Source:** decisions#grain-scope
**Where:**
**After:** 169
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
In 6.1.1 (117) Grain only reports the number of unresolved references; per-node resolution deferred.

## Why
grain measure shows 0 dependencies where yg check refuses.

## Acceptance
[test] An ambiguous symbol is resolved per graph node as yg check resolves it, and grain check gives the same edges as yg check on a fixture with a symbol declared in two nodes, red before and green after · by: cd plugins/grain && npm test

## Evidence


