# 375 · Gard: the shell's manifest, gard.yaml and gard.local.yaml

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Key:** 20261029T1425-uhko
**Tags:** gard, rig, workplace
**Files:** Gard/src/rig/manifest.mjs, Gard/src/rig/schema.mjs, Gard/test/manifest.test.mjs
**Repo:** ../../../Gard
**After:** 369, 374
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section The manifest

## What
The schema of gard.yaml (version, name, repos with dir, url and branch at any depth, container, app, checks, guards, gate, tools) and of gard.local.yaml, which may only add features, mounts and switches and never repos. Validation names the key and the line of every error, offers the nearest known name for an unknown key, allows keys that start with x-, refuses an absolute or escaping dir, two repos in one directory or in each other's directory, and a path of a computer anywhere. gard rig show prints the effective manifest and, for each value, the file it came from.

## Why
The manifest is what a team shares and what a user adds to; an error in it must say where and how to fix it, and a computer's path in it would break the rig for everyone else.

## Acceptance
- Tests cover each refusal above with its code and fix, and a valid manifest with repos at backend and own/api passes
- gard rig show --json on a rig with a local file shows the local value and its source; a repo declared in gard.local.yaml is refused

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

