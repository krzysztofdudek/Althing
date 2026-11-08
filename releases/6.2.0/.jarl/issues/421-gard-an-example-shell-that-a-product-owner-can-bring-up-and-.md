# 421 · Gard: an example shell that a product owner can bring up and record from

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, docs, container
**Files:** Gard/examples/product-owner
**Repo:** ../../../Gard
**After:** 389
**Found by:** owner
**Where:** the owner, 2026-10-29: a product owner may get a ready rig to prepare marketing materials from the application

## What
An example rig in the repository: a small demo application with two services, run from prebuilt images with demo data, plus the recording tools a rig may carry (a browser for scripted screen captures), and a short guide for someone who is not a developer: clone, gard up, open the application, record, find the files. It shows the full range Gard offers; it is not a template every application must follow.

## Why
It proves the case that widens who can work from a rig, and gives authors of applications a model to copy.

## Acceptance
The example comes up with gard up on a fixture machine with Docker and its scripted capture writes a file into a volume or a named place, and nothing new appears on the host (gard verify host-clean)

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

