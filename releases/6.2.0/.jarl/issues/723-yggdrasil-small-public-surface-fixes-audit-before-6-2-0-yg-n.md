# 723 · Yggdrasil: small public-surface fixes (audit, before 6.2.0): yg-node/1 consumes to portNames and yg-aspect-log/1 at to datetime with the old field kept for one release, camelCase for prompt-too-large and companion-error, one error code for a missing target (usage, not command-error, in build-context.ts:515 and :522), a final newline in yg aspects (aspects.ts:418), and labels in brackets that are the codes --json carries

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0513-kyds
**Tags:** yggdrasil, api
**Files:** 
**Repo:** Yggdrasil
**Found by:** jarl
**Where:** the public-surface audit, 2026-11-12, recommendations 6 and 7 and section 3.2 B to D

## What


## Why
Small shape faults in documents and codes an agent reads make the surface look less thought through than it is.

## Acceptance
[test] Each listed field, value and code is fixed, an old field stays beside the new one for one release where a published /1 document changes, error[...] in text carries the same code as --json, and one question gives one exit code across commands, each red before and green after · by: cd source/cli && npm test

## Evidence

