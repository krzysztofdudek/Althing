# 235 · Runes: an optional view of files from the commit tree instead of the disk for import resolution (D1 b, for Grain 099/106 and 010)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** runes, grain, yggdrasil, partial
**Files:** 
**Repo:** ../../../Runes, ../../../Grain, ../../../Yggdrasil
**Found by:** jarl
**Source:** decisions#patch-scope
**Where:**
**Branch:** jarl/235-file-view
**Worker:** runes-235
**Worktree:** /Users/me/.jarl-wt/Runes-235
**Since:** 2026-10-05 16:22

## What
The Runes plan D1 (b) deferred to 1.1.0 an injected file view of the commit tree; today the resolver looks at the disk, and Grain (099/106) and Yggdrasil (004/010) work around it on their side.

## Why
The same commit can give different edges depending on files built locally.

## Acceptance
The Runes resolver accepts an optional file view (exists/read) from the commit tree; Grain and Yggdrasil use it, so edges depend only on the commit's content; tests: a built dist/ directory present or not — the same edges.

## Evidence


