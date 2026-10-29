# 384 · Gard: the shell's container is generated from the team's base, the shell's layer and the user's additions

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, container
**Files:** Gard/src/container/build.mjs, Gard/src/container/merge.mjs, Gard/test/container-build.test.mjs
**Repo:** ../../../Gard
**After:** 383
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/mimir-specification.md, chapter Area elements, The layered container of a shell (issue M79 of Mimir's first loop); the dev container specification has no inheritance

## What
gard container build writes .gard/devcontainer/devcontainer.json (ignored by git) from container.base (a team's devcontainer.json inside a repo, when there is one), the rig's features and settings, and gard.local.yaml: lists are added, scalars of the rig win over the base and the user's over the rig, and every conflict is shown with the file each value came from. A rig with no base builds from its own features alone. A job reports when the team's base changed since the last build.

## Why
The user's environment lives beside the team's repository; most team repositories have no dev container at all, and those that have one must not be edited.

## Acceptance
- A base with two features and a local addition gives the expected JSON, and a scalar conflict is reported with both sources
- A rig with no base builds a container from features alone; the team's repository's git status is clean after every build

## Evidence

