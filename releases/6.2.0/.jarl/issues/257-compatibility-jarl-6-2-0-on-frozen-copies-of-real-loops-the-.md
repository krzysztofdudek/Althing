# 257 · Compatibility: Jarl 6.2.0 on frozen copies of real loops (the private repository's loops, a Horde mission) and an older Jarl's refusal of the new format

**Status:** dropped
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

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Dropped: They check Jarl 6.2.0 and what it requires of Althing, and Jarl 6.2.0 and 6.3.0 are published, with the loop already driven by 6.3.0. Ruling backlog-tidy-for-the-three-tools.

