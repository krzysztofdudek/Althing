# 390 · Gard: host ports per view

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261029T1426-jjra
**Tags:** gard, workplace, container
**Files:** Gard/src/app/ports.mjs, Gard/test/ports.test.mjs
**Repo:** ../../../Gard
**After:** 389
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section Containers, Ports

## What
Each view gets its own mapping of the ports the application publishes to host ports from a range in the computer's config, recorded in Gard's state so it stays the same across runs and is freed when the view is removed. gard ports shows the mapping. A port already taken on the host is skipped, never stolen.

## Why
Several workers bring the application up at once; inside containers ports never collide, on the host they do.

## Acceptance
Two views up at once get disjoint host ports, the same view gets the same ports after down and up, and a taken port is skipped

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

