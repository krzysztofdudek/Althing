# 276 · Compatibility: Grain's full gate with Yggdrasil 6.2.0 supplied, failing on any test skipped for want of a sibling

**Status:** open
**Kind:** test
**Priority:** 1
**Tier:** standard
**Key:** 20261006T0609-zfue
**Tags:** compatibility, grain, jarl, workspace
**Files:** Althing/workspace/checks/suites.mjs
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/workspace/checks/suites.mjs (planned with 254); Grain's tests read YG_BIN, HORDE_DIR and GRAIN_CORPUS_CLONES and skip without them; Jarl's real-loop test (skills/jarl/scripts/tests/resume.test.mjs) skips without JARL_LIVE_LOOP
**After:** 312, 269

## What
Grain's full gate (cd plugins/grain && npm test, with YG_BIN at a Yggdrasil built from the release tip and GRAIN_CORPUS_CLONES at the corpus clones) runs from the 6.2.0 trees, and the run fails on a test skipped for an environment reason. An environment built for this run is enough: it does not wait on 275. Jarl's half is settled, because Jarl 6.2.0 and 6.3.0 are published.

## Why
A skipped test proves nothing, and today Grain's cross-tool tests and Jarl's real-loop test are skipped wherever nobody supplies the siblings, CI included.

## Acceptance
- [test] Grain's full gate passes on the final release tips with YG_BIN and GRAIN_CORPUS_CLONES set, and the run names no test skipped for want of a sibling · by: cd plugins/grain && npm test
- [read] Every failure found is filed as an issue with its cause

## Evidence

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Deferred: Outside the compatibility gate of this release, and both need the workspace of 275. Ruling backlog-tidy-for-the-three-tools.

Ruling two-compatibility-checks-back-in-the-gate (by owner): The two compatibility checks moved out by backlog-tidy-for-the-three-tools return to the conditions of the release: 255 (the shape of Yggdrasil's documents against 6.1.0) and 276 (Grain's full gate with Yggdrasil supplied). The jarl proposed moving them because the workspace they named does not exist, and that was no reason to drop what they prove. Each runs in an environment built for it and does not wait on the workspace issue 275. The rest of backlog-tidy-for-the-three-tools stands. The owner wants the whole release carried out. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, and I want to carry out the whole release.""

