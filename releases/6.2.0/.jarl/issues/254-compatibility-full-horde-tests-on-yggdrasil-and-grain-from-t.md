# 254 · Compatibility: full Horde tests on Yggdrasil and Grain from the 6.2.0 branches (locally, before any push)

**Status:** dropped
**Kind:** test
**Priority:** 1
**Tier:** standard
**Tags:** compatibility, horde, workspace
**Files:** Althing/workspace/checks/suites.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**
**After:** 275

## What
Horde's tests have not yet been run on the release/6.2.0 branches of Yggdrasil and Grain — its CI starts only after a push. Horde reads Yggdrasil through the yg-*/1 documents and error codes, and Grain through its CLI; 6.2.0 changes the report's content (032), and adds codes and behaviours.

## Why



## Acceptance
The Horde suite (with HORDE_DIR and with Yggdrasil and Grain built from the 6.2.0 branches, in a scratch copy) passes; every failure is filed as an issue with its cause; run after the last Yggdrasil and Grain package is merged and again on the final tips before 224; the result recorded as --ran/--saw.

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

