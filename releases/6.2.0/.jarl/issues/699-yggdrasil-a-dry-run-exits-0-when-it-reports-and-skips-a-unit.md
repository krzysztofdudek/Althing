# 699 · Yggdrasil: a dry run exits 0 when it reports and skips a unit, and pairs on type-covered files still take the check-failed-to-run cause

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261112T0250-vtrl
**Tags:** yggdrasil, reports
**Files:** 
**Repo:** Yggdrasil
**After:** 560
**Found by:** jarl
**Where:** w-560-sonnet, memory rest package report
**Branch:** jarl/690-small-rest
**Worker:** w-690-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 03:29

## What


## Why
A dry run that skipped work should not look like a clean one to a script, and a type-covered file left unverified by the parser-memory or text-limit case should carry the same cause as a mapped file (639, 655).

## Acceptance
[test] A dry run that reports and skips a unit exits non-zero with the unit named, and a type-covered file's pair left unverified by the parser-memory or text-limit case carries that cause, red before and green after · by: cd source/cli && npm test

## Evidence

