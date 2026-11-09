# 381 · Gard: a view holds a worktree of the shell itself when a change touches it

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261029T1425-jwxu
**Tags:** gard, workplace, worktrees, drift
**Files:** Gard/src/worktree/rig-view.mjs, Gard/test/worktree-rig.test.mjs
**Repo:** ../../../Gard
**After:** 379
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section Layout: when a change also touches the rig

## What
gard worktree add --rig makes the view directory itself a worktree of the rig on the view's branch, with the repo worktrees inside it in their ignored directories, so the view's container is built from the rig in that state. A view without --rig uses the rig's main checkout for its definitions. The pair of branches (code and rig) is recorded.

## Why
A change of the application that also changes its environment (a new service, a new check) must be tried and merged as one.

## Acceptance
A test makes a view with --rig, changes the container definition in it and shows that the view's generated container differs from the main checkout's

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

