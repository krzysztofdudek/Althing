# 388 · Gard: one volume per worktree, and an optional shared package cache

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261029T1426-smpx
**Tags:** gard, workplace, container, worktrees
**Files:** Gard/src/container/volumes.mjs, Gard/test/volumes.test.mjs
**Repo:** ../../../Gard
**After:** 387
**Found by:** owner
**Where:** the owner's ruling of 2026-10-29: one volume per worktree, since a view is one directory; it replaces Mimir's earlier rule that all worktrees of a repo share volumes

## What
Every worktree's dependencies live in a volume of their own, named by the view and the repo; no two views share one, so two workers installing different dependencies at once cannot overwrite each other. A cache volume of the package manager may be shared across views (a switch, on for npm and pnpm, which are made for concurrent use). Data of the application's services live in volumes of the view.

## Why
Parallel workers on different branches with different dependencies are the normal case of a Jarl loop.

## Acceptance
- A test with two views installing different versions of one package at the same time ends with each view holding its own version
- With the cache switched on, the second install of the same lockfile in another view downloads nothing (counted by the fake registry)

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

