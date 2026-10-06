# 234 · Runes: a diagnostics channel for an unreadable tsconfig.json/package.json, shown by Yggdrasil (the second half of 074, D9)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** runes, yggdrasil, partial
**Files:** 
**Repo:** ../../../Runes, ../../../Yggdrasil
**Found by:** jarl
**Source:** decisions#patch-scope
**Where:**
**Branch:** jarl/235-file-view
**Worker:** runes-235
**Worktree:** /Users/me/.jarl-wt/Runes-235
**Since:** 2026-10-05 16:22

## What
In 1.0.1 (074) the resolver strips the BOM; reporting configuration files that cannot be parsed deferred to 1.1.0 (it needs a new option).

## Why
A broken tsconfig silently switches off all the aliases under it — fewer edges without any trace.

## Acceptance
makeResolvePathToFile accepts an optional diagnostics callback (documented in docs/api.md as a minor addition); an unreadable tsconfig/package.json is reported with the file and position; Yggdrasil shows it as a non-blocking warning with the file name; Grain disclosure in relStages; tests.

## Evidence


