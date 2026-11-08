# 461 · Mimir: an independent review of the code that deletes or overwrites data, before publication

**Status:** dropped
**Kind:** process
**Priority:** 2
**Tier:** strong
**Tags:** mimir, workplace, security, needs-owner
**Files:** 
**Repo:** ../../../Mimir
**After:** 433
**Found by:** jarl
**Where:** the code paths that remove or rewrite something of the user's: undo and finish of a topic, cleanup of products and worktrees, the session archive, uninstall, the build of vectors

## What
A reviewer of the strongest class who wrote none of it reads every path that deletes or overwrites data, against the proportionality rule (protect against real loss and deletion, nothing more), and files every finding. Run only on the owner's word, because it is the most expensive review of the loop.

## Why
Deletion is the one thing the owner wants protected even in internal tooling; a strong reviewer on exactly those paths costs less than one lost day of work.

## Acceptance
The review's findings are filed as issues, each with the path and the case; a path with no finding is listed as read

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

