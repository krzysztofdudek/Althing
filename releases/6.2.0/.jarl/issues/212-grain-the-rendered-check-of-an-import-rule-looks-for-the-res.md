# 212 · Grain: the rendered check of an import rule looks for the resolved specifier (e.g. ~/lib/base), which never appears in the source text

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, imports, 6.2
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-200
**Where:**
**Branch:** jarl/003-check-populations
**Worker:** grain-003
**Worktree:** /Users/me/.jarl-wt/Grain-003
**Since:** 2026-10-05 16:22

## What
Reported by the worker of package 200; reviewer rev-grain-200: not live in 6.1.1, because this import rule stays a draft and yg check does not run it. Older than this package.

## Why



## Acceptance
The import-rule check matches the specifier in the form in which it stands in the source (alias/path) before the rule can become enforced; test red→green.

## Evidence


