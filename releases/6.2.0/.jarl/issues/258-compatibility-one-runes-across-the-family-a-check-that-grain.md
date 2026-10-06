# 258 · Compatibility: one Runes across the family — a check that Grain (vendor), Yggdrasil (npm dependency), Horde (vendor) and Jarl (pin) point to the same Runes version

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Tags:** compatibility, runes, workspace
**Files:** Althing/workspace/checks/pins.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**
**After:** 275

## What
Runes reaches the family by four routes (Grain and Horde vendor it, Jarl pins it, Yggdrasil depends on it from npm); Grain's contract test guards only the Grain–Yggdrasil pair.

## Why



## Acceptance
One command (a script in the place settled by the decision on the family workspace) reads the four pointers and ends with an error when the versions or commits differ; run in 224 before the tags; the result recorded.

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

