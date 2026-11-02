# 429 · Mimir: a shell is an area with code repositories in any of its subdirectories

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** mimir, rig, workplace
**Files:** Mimir/src/manifest, Mimir/src/registry, Mimir/src/context
**Repo:** ../../../Mimir
**After:** 426
**Found by:** owner
**Where:** Mimir at 10257cd: a shell is an area whose repos[].dir is source (issue M80 of Mimir's first loop)

## What
An area may hold any number of code repositories in subdirectories at any depth (backend, frontend, own/api), declared by repos[].dir, as Gard's rigs do. The special meaning of source/ is removed. The context of a path inside one of them names the area and that repo. When the directory is also a Gard rig, Mimir reads the repos from either declaration and reports a disagreement between them.

## Why
The owner, 2026-10-29: the rig sits at the level of the application, with all its repositories, so that one container brings the whole application up.

## Acceptance
- A fixture area with repos at backend and own/api resolves a path in each to the area and the right repo
- An area that is also a rig with a different repo list in gard.yaml gets a warning naming the difference

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

