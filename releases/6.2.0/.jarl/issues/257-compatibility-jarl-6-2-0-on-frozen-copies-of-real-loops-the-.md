# 257 · Compatibility: Jarl 6.2.0 on frozen copies of real loops (the private repository's loops, a Horde mission) and an older Jarl's refusal of the new format

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Key:** 20261005T1855-cdry
**Tags:** compatibility, jarl, workspace
**Files:** Althing/workspace/checks/loops.mjs
**Repo:** ../..
**After:** 312, 251, 252
**Found by:** jarl
**Where:**

## What
The private repository's loops (release-6.0.0, 6.1.0, 6.2.0) and the Horde missions are written with Jarl 6.1.0; Jarl 6.2.0 changes the way the record is written (248, 245, 246, 252). Amended under the ruling jarl-release-alone-with-every-jarl-issue and the architect's scope review of 2026-10-18 (Q8): Jarl ships alone before the workspace's W0 (275) is done, so the Jarl half of this check runs first and directly, before Jarl's tag (313): from the frozen copies, with explicit paths and an explicit timeout on every command, each result a --ran/--saw row on this issue. The issue stays open for the family release, where the cross-tool check runs again through ws on the 6.2.0 trees once 275 has built them; that later run waits on 275, which is why 275 is no longer on this issue's After line (the line would hold back the Jarl half too).

## Why



## Acceptance
- The Jarl half, before 313's tag, run directly with explicit paths and timeouts, each a --ran/--saw row here: on the copies, Jarl 6.2.0's status, resume, list, show --full, report, next --all and verify read every loop without errors and with the same numbers as 6.1.0, verify reports exactly the known anomalies, and nothing on these loops raises the format; the Horde mission read by Jarl 6.2.0; the pinned Jarl 6.1.0 refuses, with a clear message, a loop written in format 2 by each trigger (a name, issue 1000, ask a-1000, a retraction) (252)
- The family half, through ws once 275 has built the trees: the same reading repeated on the 6.2.0 trees, and the Horde mission read by Horde with the new vendored copy; the issue closes only after this half

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

