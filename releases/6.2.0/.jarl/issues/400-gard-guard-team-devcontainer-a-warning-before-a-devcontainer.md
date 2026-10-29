# 400 · Gard guard team-devcontainer: a warning before a devcontainer enters a team's repository

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** gard, workplace, guards, hooks
**Files:** Gard/src/guards/team-devcontainer.mjs, Gard/test/guard-team-devcontainer.test.mjs
**Repo:** ../../../Gard
**After:** 394
**Found by:** owner
**Where:** Mimir at 10257cd: test/fixtures/owner-guards-module-copy/40-devcontainer.mjs (issue M80 of Mimir's first loop)

## What
From a rig, a write that creates .devcontainer inside one of the rig's code repositories is answered with a warning that the environment belongs to the rig, unless the team decided otherwise. Off by default.

## Why
The owner, 2026-10-26: devcontainers go to the rig by default, not into company repositories, unless the team decides; one person's way of working must not land on others.

## Acceptance
With the switch on, the write is answered with the warning; off, nothing is said

## Evidence

