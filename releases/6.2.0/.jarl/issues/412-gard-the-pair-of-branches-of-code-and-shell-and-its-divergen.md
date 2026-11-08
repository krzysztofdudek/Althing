# 412 · Gard: the pair of branches of code and shell, and its divergence after a squash

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, drift, port
**Files:** Gard/src/drift/pair.mjs, Gard/test/pair.test.mjs
**Repo:** ../../../Gard
**After:** 381
**Found by:** owner
**Where:** Mimir at 10257cd: the state of a pair of branches and the detection of a divergence after a squash merge (issue M64 of Mimir's first loop; src/topic/branches.mjs, src/worktree/branch-state.mjs)

## What
When a view holds both a code branch and a rig branch of the same name, Gard records the pair and reports its state: both open, one merged and the other not, or merged by a squash on one side so that the branches look diverged although the content landed.

## Why
A change that needs both sides must land on both; a pair left half merged breaks the rig for the next user.

## Acceptance
Tests cover a pair merged on both sides, one side only, and a squash merge on one side recognised as landed

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

