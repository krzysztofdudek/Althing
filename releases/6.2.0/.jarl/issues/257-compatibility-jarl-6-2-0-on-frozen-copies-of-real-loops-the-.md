# 257 · Compatibility: Jarl 6.2.0 on frozen copies of real loops (the private repository's loops, a Horde mission) and an older Jarl's refusal of the new format

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Tags:** compatibility, jarl, workspace
**Files:** Althing/workspace/checks/loops.mjs
**Repo:** ../..
**After:** 275, 251, 252
**Found by:** jarl
**Where:**

## What
The private repository's loops (release-6.0.0, 6.1.0, 6.2.0) and the Horde missions are written with Jarl 6.1.0; Jarl 6.2.0 changes the way the record is written (248, 245, 246, 252).

## Why



## Acceptance
On the copies: Jarl 6.2.0's status, resume, list, show, report and verify read every loop without errors and with the same numbers as 6.1.0; the Horde mission read by Jarl 6.2.0 and by Horde with the new vendored copy; Jarl 6.1.0 refuses a loop written in the new format with a clear message (252).

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

