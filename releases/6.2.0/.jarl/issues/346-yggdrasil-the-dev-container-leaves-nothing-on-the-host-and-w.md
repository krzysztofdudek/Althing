# 346 · Yggdrasil: the dev container leaves nothing on the host, and workers in it use clones on a volume instead of worktrees

**Status:** dropped
**Kind:** process
**Priority:** 1
**Tier:** standard
**Key:** 20261028T0938-eirr
**Tags:** gard, workplace
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** owner
**Where:**
**After:** 379, 385, 387, 392, 414, 424

## What
The owner removed the Yggdrasil dev container and image; the release's Yggdrasil check runs inside it (the goal's Check line), so it comes back, reworked first so that it leaves nothing on the host (the owner, 2026-10-28, translated: 'the container must not leave anything on the host's disk, and the current devcontainer has to be reworked before you bring it back'). Under the ruling family-repos-through-gard it comes back through Gard alone: Yggdrasil becomes a root of Gard, its dev container stays its own and Gard adds a volume over every directory a tool writes under the checkout (found by running the tests and a docs build), the npm cache and TMPDIR live in the container, commands run through gard run as the container's user, and loop workers get their worktrees as Gard's views instead of worktrees inside the container. The worktree entries an earlier container left in the host's git are cleared on the owner's word.

## Why
A container that writes into the checkout or the host's git fills the internal disk and leaves state another session trips over; the release needs Yggdrasil's tests run as CI runs them.

## Acceptance
- gard verify host-clean around cd source/cli && npm test and a docs build lists nothing new on the host but the empty mount points, recorded as a row
- Removing Yggdrasil's containers and volumes through gard cleanup leaves nothing of its environment on the host
- The worker brief for Yggdrasil cuts a worktree with gard worktree add and runs the check with gard run

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: This work runs through Gard alone, and Gard is out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

