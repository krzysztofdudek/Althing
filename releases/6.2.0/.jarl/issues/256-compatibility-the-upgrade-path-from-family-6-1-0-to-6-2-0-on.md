# 256 · Compatibility: the upgrade path from family 6.1.0 to 6.2.0 on a repository with existing state (locks, caches, a Jarl loop, a Horde mission)

**Status:** open
**Kind:** test
**Priority:** 1
**Tier:** standard
**Tags:** compatibility, upgrade, workspace
**Files:** Althing/workspace/checks/upgrade.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**
**After:** 275, 254, 276

## What
The user does not start from zero: they have Yggdrasil 6.1.0's locks and caches, Grain 6.1.0's model and history, a Jarl 6.1.0 loop, a Horde mission. The release deliberately changes behaviour ('Before you upgrade' notes), and Grain bumps MODEL_V/HIST_V/EXTR_V.

## Why



## Acceptance
A fixture plus one real repository from the corpus: adopted and used with family 6.1.0 (yg check, grain refresh, a Jarl loop, a Horde mission), then an upgrade to 6.2.0: every tool works, caches rebuild without errors, the old Jarl loop and the Horde mission are read; every turn to red after the upgrade is described in 'Before you upgrade' with a fix that removes it (checked by running the fix).

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

