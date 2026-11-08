# 432 · Mimir's worktrees and topics go through Gard

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** mimir, gard, workplace, worktrees, compatibility
**Files:** Mimir/src/worktree, Mimir/src/topic/finish.mjs
**Repo:** ../../../Mimir
**After:** 426, 380
**Found by:** owner
**Where:** Mimir at 10257cd: src/worktree puts a worktree at <repo>/.worktrees/<slug> and records it; src/topic/finish.mjs ends a topic

## What
With Gard installed, Mimir's worktree open asks Gard for a view (the topic's slug as Gard's topic, the work as the view), and the end of a topic asks Gard to remove the topic's views after Mimir's own steps; Mimir's record of worktrees reads Gard's list. Without Gard, Mimir keeps its own place for worktrees under the same layout, topic, view and repo.

## Why
The owner, 2026-10-29: Gard owns the place of worktrees, and every tool follows it.

## Acceptance
- With a fake gard, opening a topic's worktree calls gard worktree add with the topic's slug, and finishing the topic calls remove for the topic
- Without gard, the same commands put worktrees in the same layout

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

