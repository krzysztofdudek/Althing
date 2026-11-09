# 401 · Gard: switches and settings of the guards

**Status:** dropped
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Key:** 20261029T1427-eojf
**Tags:** gard, workplace, guards
**Files:** Gard/src/guards/settings.mjs, Gard/test/guard-settings.test.mjs
**Repo:** ../../../Gard
**After:** 394
**Found by:** owner
**Where:** Mimir at 10257cd: the separate switch of each block and the per-area exceptions (M56)

## What
Each guard has a switch in the rig's manifest and in the computer's config; the computer's config wins. The defaults: host-run, script-ban and temp on; disk and stray on only when the user gave values; team-devcontainer off. A refusal names its switch. gard doctor lists the guards in force for the current root and where each switch came from.

## Why
Anyone may want some guards and not others; a refusal the user cannot turn off is a guard that gets in the way.

## Acceptance
Tests show the computer's switch winning over the rig's, the refusal naming its switch, and doctor listing the guards with their sources

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

