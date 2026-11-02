# 389 · Gard: gard up, down and status bring up the whole application of a view

**Status:** deferred
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, container
**Files:** Gard/src/app/up.mjs, Gard/src/app/compose.mjs, Gard/test/app.test.mjs
**Repo:** ../../../Gard
**After:** 388
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, sections Containers and Principles (the full range, and the author's job)

## What
gard up starts the services the rig's app declares for a view (its compose file), each from the view's worktree or from a prebuilt image as declared, with the view's data volumes, its network and its project name; down stops them and keeps the volumes; status lists every service with its state and its host ports. Gard limits nothing the author can declare: build from sources, images, seeds, services a repo needs from another.

## Why
One container that brings up the whole application is the reason the rig holds several repositories; a product owner gets the running application from one command.

## Acceptance
- A fixture rig with two services (one built from a repo, one from an image) comes up for two views at once without collisions, and down leaves the volumes
- status --json lists each service with its state and its ports

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

