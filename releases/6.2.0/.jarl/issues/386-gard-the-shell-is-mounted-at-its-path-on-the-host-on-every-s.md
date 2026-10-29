# 386 · Gard: the shell is mounted at its path on the host, on every system

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, container, windows
**Files:** Gard/src/container/mounts.mjs, Gard/test/container-mounts.test.mjs
**Repo:** ../../../Gard
**After:** 384
**Found by:** owner
**Where:** git writes absolute paths into a worktree's .git file and into the repository's worktree records; a container that mounts the checkout elsewhere breaks them, which is why the Yggdrasil container kept its worktrees inside itself

## What
The generated container mounts the rig at the same absolute path it has on the host, so a worktree made on either side works on both. On Windows the path rule of the container runtime is applied and documented; where a same path is impossible, the answer says so and names what does not work. gard doctor checks that a running container of a view mounts its rig at that path.

## Why
Worktrees on the host are code and must stay usable from the host's editor and from the container alike.

## Acceptance
- A test makes a worktree on the host and runs git status in it through the container, and the reverse, both clean
- doctor reports a container whose mount differs, with the fix

## Evidence

