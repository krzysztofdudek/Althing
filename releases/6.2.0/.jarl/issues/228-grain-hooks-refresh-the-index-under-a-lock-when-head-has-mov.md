# 228 · Grain: hooks refresh the index under a lock when HEAD has moved since indexing, instead of going silent (the second half of 107)

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** grain, hooks, partial
**Files:** 
**Repo:** ../../../Grain
**Found by:** jarl
**Source:** decisions#grain-scope
**Where:**
**Branch:** jarl/228-hooks-refresh
**Worker:** grain-228
**Worktree:** /Users/me/.jarl-wt/Grain-228
**Since:** 2026-10-05 16:22

## What
In 6.1.1 (107) hooks stay silent when HEAD has moved since indexing; refreshing under a lock deferred to 6.2 (grain-scope).

## Why
After every commit the agent loses hints until a manual refresh.

## Acceptance
A hook with a moved HEAD starts an incremental refresh under a lock (one builder, the rest wait a bounded time or answer with a clear marker that the index is being refreshed), and answers from the index for the current HEAD; no advice comes from the index of another HEAD; tests: a commit with git mv, parallel hooks, an interrupted refresh.

## Evidence


