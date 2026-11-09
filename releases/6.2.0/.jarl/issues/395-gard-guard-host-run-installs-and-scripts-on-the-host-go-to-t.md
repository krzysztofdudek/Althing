# 395 · Gard guard host-run: installs and scripts on the host go to the container

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261029T1427-vzcb
**Tags:** gard, workplace, guards, hooks
**Files:** Gard/src/guards/host-run.mjs, Gard/test/guard-host-run.test.mjs
**Repo:** ../../../Gard
**After:** 394, 387
**Found by:** owner
**Where:** Mimir at 10257cd: test/fixtures/owner-guards-module-copy (20-host-run.mjs and owner-guards-lib/host-run.mjs) is the module that runs today

## What
In a root that has a container, a command that installs packages or runs the project's scripts on the host is refused, and the refusal gives the same command through gard run, ready to copy. The same command through gard run passes, as does any command in a root without a container and any command the user allows in the computer's config. Shell commands are read heuristically; the guard says so in its refusal when it is unsure.

## Why
The owner, 2026-10-24: entering a repository, the default is the project's container and never installing packages on the host.

## Acceptance
Tests cover npm, pnpm, pip and a project script refused with the right gard run command, the same through gard run passing, and a root without a container passing

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

