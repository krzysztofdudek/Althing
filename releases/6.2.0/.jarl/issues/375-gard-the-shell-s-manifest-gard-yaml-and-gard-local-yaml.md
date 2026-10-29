# 375 · Gard: the shell's manifest, gard.yaml and gard.local.yaml

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** gard, workplace, shell
**Files:** Gard/src/shell/manifest.mjs, Gard/src/shell/schema.mjs, Gard/test/manifest.test.mjs
**Repo:** ../../../Gard
**After:** 369, 374
**Found by:** owner
**Where:** research/2026-10-29-mimir-and-gard/gard-design.md, section The manifest

## What
The schema of gard.yaml (version, name, repos with dir, url and branch at any depth, container, app, checks, guards, gate, tools) and of gard.local.yaml, which may only add features, mounts and switches and never repos. Validation names the key and the line of every error, offers the nearest known name for an unknown key, allows keys that start with x-, refuses an absolute or escaping dir, two repos in one directory or in each other's directory, and a path of a computer anywhere. gard shell show prints the effective manifest and, for each value, the file it came from.

## Why
The manifest is what a team shares and what a user adds to; an error in it must say where and how to fix it, and a computer's path in it would break the shell for everyone else.

## Acceptance
- Tests cover each refusal above with its code and fix, and a valid manifest with repos at backend and own/api passes
- gard shell show --json on a shell with a local file shows the local value and its source; a repo declared in gard.local.yaml is refused

## Evidence

