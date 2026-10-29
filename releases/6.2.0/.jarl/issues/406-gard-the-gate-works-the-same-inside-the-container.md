# 406 · Gard: the gate works the same inside the container

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, git-gate, container
**Files:** Gard/test/gate-container.test.mjs
**Repo:** ../../../Gard
**After:** 402, 387
**Found by:** owner
**Where:** the owner, 2026-10-27: commits happen in the container, because the host has nothing installed

## What
A test commits inside a view's container and on the host in the same worktree, with the same rules and the same result, and the paths the stubs use resolve on both sides.

## Why
A gate that runs only on the host would let every commit made in the container through.

## Acceptance
The same blocking rule refuses the same commit in the container and on the host (with real Docker, skipped with the reason where it is missing)

## Evidence

