# 398 · Gard guard disk: a free-space threshold and a limit on a session's scratchpad

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261029T1427-pasp
**Tags:** gard, workplace, guards, hooks
**Files:** Gard/src/guards/disk.mjs, Gard/test/guard-disk.test.mjs
**Repo:** ../../../Gard
**After:** 394
**Found by:** owner
**Where:** Mimir at 10257cd: test/fixtures/owner-guards-module-copy/50-disk-guard.mjs and owner-guards-lib/disk.mjs; issue M123 of Mimir's first loop (the scratchpad limit)

## What
With a threshold of free space and a limit of a session's scratchpad given by the user in the computer's config, a write is refused when the disk is below the threshold or the session's scratchpad is over its limit, and the refusal lists the ten largest files with their sizes and the cleaning command. Cleaning always passes (gard cleanup, docker system prune, deleting inside the scratchpad). With no values given the guard does nothing, because a threshold is the user's number.

## Why
An agent once filled the disk with hundreds of renders and screenshots it never cleaned, and every container stopped for lack of space.

## Acceptance
- An injected limit with a scratchpad over it refuses a write with the list of files; under it the write passes; with no value set nothing is refused
- Cleaning commands pass while the disk is below the threshold

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

