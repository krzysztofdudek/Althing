# 254 · Compatibility: full Horde tests on Yggdrasil and Grain from the 6.2.0 branches (locally, before any push)

**Status:** open
**Kind:** test
**Priority:** 1
**Tier:** standard
**Tags:** compatibility, horde
**Files:** Althing/workspace/checks/suites.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**

## What
Horde's tests have not yet been run on the release/6.2.0 branches of Yggdrasil and Grain — its CI starts only after a push. Horde reads Yggdrasil through the yg-*/1 documents and error codes, and Grain through its CLI; 6.2.0 changes the report's content (032), and adds codes and behaviours.

## Why



## Acceptance
The Horde suite (with HORDE_DIR and with Yggdrasil and Grain built from the 6.2.0 branches, in a scratch copy) passes; every failure is filed as an issue with its cause; run after the last Yggdrasil and Grain package is merged and again on the final tips before 224; the result recorded as --ran/--saw.

## Evidence


