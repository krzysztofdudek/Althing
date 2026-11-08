# 368 · Gard: its own dev container leaves only code on the host

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, foundation, container
**Files:** Gard/.devcontainer, Gard/scripts/dev.mjs
**Repo:** ../../../Gard
**After:** 367
**Found by:** owner
**Where:** ruling family-repos-leave-only-code-on-host; the pattern of issue 346; Mimir's scripts/dx at 10257cd is the model of a runner that needs no dev container CLI on the host

## What
A named dev container for developing Gard: every directory a tool writes under the checkout is a named volume over that path (node_modules, coverage, caches), the npm cache and TMPDIR live in the container, a post-start step empties the temporary folder, commands run as the container's user, and the checkout is mounted at its path on the host. A saved script runs a command in it (start, run, stop, clean) until gard run can replace it; it needs no dev container CLI on the host.

## Why
Gard is the tool that keeps hosts clean; its own development must not be the first thing that litters one.

## Acceptance
- After npm ci and npm test through the script, git status --ignored --short on the host lists nothing new but the empty mount points (a row of evidence)
- The script's clean step removes the container and its volumes, after which nothing of it is left on the host

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

