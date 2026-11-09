# 359 · Althing: the registry and the family's pages name Mimir and Gard as tools of the workplace

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261029T1423-zsre
**Tags:** althing, workplace, workspace
**Files:** Althing/family/registry.json, Althing/family/map.md, Althing/family/inventory.md, Althing/family/contracts.md, Althing/method/environment.md, Althing/workspace
**Repo:** ../..
**Found by:** owner
**Where:** family/registry.json (schema family-registry/1) knows the kinds core, add-on and shared only; the design is research/2026-10-29-mimir-and-gard/README.md

## What
The registry gains a third kind, workplace (a tool of the computer on which the work is made, with a version of its own and no dependency on the core), and two entries of that kind: gard (krzysztofdudek/Gard, npm @chrisdudek/gard, command gard) and mimir (krzysztofdudek/Mimir, npm @chrisdudek/mimir, command mimir), each with its build and its check. family/map.md gets the workplace axis beside the change in a repository, with one row per tool, its role and its repository; family/inventory.md and family/contracts.md name the two tools (no machine contract of the core yet); method/environment.md lists Gard and Mimir among the sibling checkouts and in the shape of ws.local.json. Every reader of the registry in workspace/ (doctor, status, brief, check canon-sync) accepts the new kind instead of assuming the three it knows.

## Why
The owner, 2026-10-29: new tools enter 6.2.0, and the family grows by a second axis, the workplace; until the registry knows them, no command of the workspace sees the two repositories and the rail that holds the canon to the registry cannot check them.

## Acceptance
- family/registry.json declares the kind workplace and the entries gard and mimir with github, build, check and npm; the rail canon/registry-consistent passes
- ws doctor reports the sibling checkouts of Gard and Mimir and their branches; a test in workspace/test feeds a registry with a workplace entry through doctor, status and brief
- family/map.md has the workplace axis with Mimir and Gard; npm test and yg check pass

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Ruling ask-022 (ratify): No longer applies, because the tools it concerns are out of the loop. Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." He did not rule on this item itself. Ruling mimir-gard-horde-out-of-the-6-2-0-loop.

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

