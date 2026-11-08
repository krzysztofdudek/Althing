# 380 · Gard: gard worktree list, remove and refresh

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, worktrees
**Files:** Gard/src/worktree/list.mjs, Gard/src/worktree/remove.mjs, Gard/src/worktree/refresh.mjs, Gard/test/worktree-life.test.mjs
**Repo:** ../../../Gard
**After:** 379
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section Worktrees and views

## What
list shows every topic and view with each worktree's branch or commit, uncommitted changes and whether its branch is merged into the topic's. remove takes a view or a whole topic: it refuses a worktree with uncommitted or unpushed work unless told explicitly, removes the worktrees through git (never by deleting directories), and asks the cleanup layer to remove the view's containers and volumes. refresh moves the detached worktrees of a view to the topic's newest commit and leaves the ones on a branch alone.

## Why
A merger removes an issue's view after the merge, and the end of a topic removes all of them; neither may lose somebody's work.

## Acceptance
- A test removes a clean view and refuses a dirty one with its fix; git worktree list of every repo shows no dangling entry afterwards
- refresh after a new commit on the topic branch moves only the detached worktrees (a test reads each HEAD)

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

