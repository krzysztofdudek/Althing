# 425 · The workspace runs the family's repositories through Gard

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** althing, workplace, workspace
**Files:** Althing/workspace, Althing/method/environment.md
**Repo:** ../..
**After:** 387, 424
**Found by:** jarl
**Where:** ws.local.json holds an exec prefix per repository (docker exec into the Yggdrasil container); the workspace's planned env, up and run commands would be a second runner

## What
ws reads the root of each sibling checkout through gard where and runs every command of a repository through gard run, instead of an exec prefix of its own; ws doctor checks that Gard is installed and that each repository's container is defined. The planned run commands of the workspace use the same path. Issue 354 is satisfied for the workspace's own runs by this.

## Why
One runner for the whole family means one place that keeps the host clean, and no drift between how a worker and how the workspace run a repository.

## Acceptance
- A test of the workspace with a fake gard sees every repository command go through gard run with the right root
- ws doctor reports a missing gard with its fix

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

