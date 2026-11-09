# 256 · Compatibility: the upgrade path from family 6.1.0 to 6.2.0 on a repository with existing state (locks, caches, a Jarl loop, a Horde mission)

**Status:** open
**Kind:** test
**Priority:** 1
**Tier:** standard
**Key:** 20261005T1855-ihvp
**Tags:** compatibility, upgrade, workspace
**Files:** Althing/workspace/checks/upgrade.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**

## What
The user does not start from zero: they have Yggdrasil 6.1.0's locks and caches, Grain 6.1.0's model and history, a Jarl 6.1.0 loop, a Horde mission. The release deliberately changes behaviour ('Before you upgrade' notes), and Grain bumps MODEL_V/HIST_V/EXTR_V.

## Why



## Acceptance
A fixture plus one real repository from the corpus: adopted and used with family 6.1.0 (yg check, grain refresh, a Jarl loop, a Horde mission), then an upgrade to 6.2.0: every tool works, caches rebuild without errors, the old Jarl loop and the Horde mission are read; every turn to red after the upgrade is described in 'Before you upgrade' with a fix that removes it (checked by running the fix).

## Evidence


jarl: under the move (althing-move) these are the workspace design's packages (research/2026-10-05-family-workspace/design.md, the table "Plan changes under A"): 239 is W1; 254 and 258 are W2, with 276 (Grain's full gate and Jarl's suite); 255 is W3; 256 is W4; 257 is W5, its cross-tool half (Jarl's own half stays with Jarl's issues); 259 is W6. W0 (275) builds the per-commit trees and the environment each of them runs on, so each now waits on it; 256 also waits on the suites runner of W2 (254, 276), as the design orders it.

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

