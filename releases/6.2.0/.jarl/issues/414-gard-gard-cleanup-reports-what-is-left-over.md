# 414 · Gard: gard cleanup reports what is left over

**Status:** deferred
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** gard, workplace, cleanup, port
**Files:** Gard/src/cleanup/report.mjs, Gard/src/cleanup/docker.mjs, Gard/src/cleanup/scratchpads.mjs, Gard/test/cleanup.test.mjs
**Repo:** ../../../Gard
**After:** 383
**Found by:** owner
**Where:** Mimir at 10257cd: src/cleanup (report.mjs, docker.mjs, scratchpads.mjs, settings.mjs) and the reviews of it (M29, M100, M156)

## What
A report of containers, volumes, images and networks of views that no longer exist, views whose branches are gone, test containers left running, and scratchpads of agent sessions that ended and are older and larger than the user's thresholds. Docker is optional: a computer without it, or with one that does not answer, gets one warning and the rest of the report. Nothing is removed by the report.

## Why
Litter accumulates where nobody looks; the owner wants one report and one approval instead of hunting through Docker and temporary folders.

## Acceptance
With the fake docker, the report lists the leftovers of a removed view and not those of a live one; with docker missing it warns once and still lists scratchpads

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

