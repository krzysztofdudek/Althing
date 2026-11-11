# 597 · Yggdrasil: npm audit on release/6.2.0 reports advisories no issue covers: brace-expansion 5.0.9 (hi…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1445-exhx
**Tags:** 
**Files:** 
**Repo:** Yggdrasil
**Found by:** rev-356-fable
**Where:** the review of 356
**Branch:** jarl/356-dependency-alerts
**Worker:** w-356-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 14:45

## What
Yggdrasil: npm audit on release/6.2.0 reports advisories no issue covers: brace-expansion 5.0.9 (high) and minimatch 10.2.6 (moderate) among the CLI's runtime dependencies, and vue with @vue/server-renderer 3.5.28 (high) in docs

## Why


## Acceptance


[test] npm audit in source/cli and in docs lists no advisory that an in-range update closes, and every advisory left is named in the CHANGELOG with why it stays · by: cd source/cli && npm test

## Evidence

