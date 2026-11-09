# 382 · Gard: doctor reports orphaned and merged views

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261029T1425-koyq
**Tags:** gard, workplace, worktrees, cleanup
**Files:** Gard/src/worktree/doctor.mjs, Gard/test/worktree-doctor.test.mjs
**Repo:** ../../../Gard
**After:** 380
**Found by:** owner
**Where:** Mimir at 10257cd: src/worktree/doctor.mjs and the header line on orphaned worktrees are the model

## What
gard doctor lists views whose branch is gone, whose worktree directory is gone while git still records it, and whose branch is merged into the topic's, each with the command that clears it. It never removes anything itself.

## Why
Left-over views are what litters a disk over weeks; the owner wants them reported, and removed only on a word.

## Acceptance
Tests cover each of the three states with its reported command, and doctor changes nothing on disk

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

