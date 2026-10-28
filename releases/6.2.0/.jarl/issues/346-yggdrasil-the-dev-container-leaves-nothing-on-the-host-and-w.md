# 346 · Yggdrasil: the dev container leaves nothing on the host, and workers in it use clones on a volume instead of worktrees

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** owner
**Where:**

## What
The owner removed the Yggdrasil dev container and image; the release's Yggdrasil check runs inside it (the goal's Check line), so it comes back, reworked first so that it leaves nothing on the host (the owner, 2026-10-28, translated: 'the container must not leave anything on the host's disk, and the current devcontainer has to be reworked before you bring it back'). The pattern, from two other projects of the owner whose containers were reworked the same way: every directory a tool writes under the bind-mounted checkout gets a named volume over that exact path (found by running the tests and a docs build, then git status --ignored on the host); an npm cache volume and npm_config_cache outside the checkout; TMPDIR on the container's disk, emptied by a defensive post-start script; post-create chowns every volume to the container user; a directory a build deletes and re-creates cannot be a mount point; commands run with docker exec --user node. Worker worktrees in a folder inside the container left locked, dangling entries in the host's git; workers use clones on a volume instead (git clone --local, results fetched back), so nothing is registered in the host's git.

## Why
A container that writes into the checkout or the host's git fills the internal disk and leaves state another session trips over; the release needs Yggdrasil's tests run as CI runs them.

## Acceptance
- After cd source/cli && npm test and a docs build in the container, git status --ignored --short on the host lists nothing new but the empty mount points, recorded as a row
- Removing the container, its yggdrasil-* volumes and its image leaves nothing of it on the host
- The worker brief for Yggdrasil says how a worker gets a clone on the volume and how its branch comes back

## Evidence

