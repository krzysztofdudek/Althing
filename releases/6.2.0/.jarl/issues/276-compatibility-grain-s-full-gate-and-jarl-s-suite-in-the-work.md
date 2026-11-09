# 276 · Compatibility: Grain's full gate and Jarl's suite in the workspace's environment, failing on any test skipped for want of a sibling (with 254, package W2)

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
Package W2 of the workspace design runs every tool's suite in the full environment, not only Horde's (254). Grain's full gate (cd plugins/grain && npm test, with YG_BIN, HORDE_DIR and GRAIN_CORPUS_CLONES from ws env) and Jarl's suite (cd skills/jarl/scripts && npm test, with JARL_LIVE_LOOP) run from the 6.2.0 trees. The check parses each suite's output and fails on a test skipped for an environment reason; a test skipped for a platform is reported, not failed. Amended under the ruling jarl-release-alone-with-every-jarl-issue and the architect's scope review of 2026-10-18 (Q8): Jarl ships alone before the workspace's W0 (275) is done, so Jarl's half runs first and directly, before Jarl's tag (313): npm test in skills/jarl/scripts with JARL_LIVE_LOOP set to a frozen copy of a real loop, an explicit path and an explicit timeout, recorded as a --ran/--saw row here. The issue stays open for the family release, where ws check suites runs both halves on the 6.2.0 trees once 275 has built them; that later run waits on 275, which is why 275 is no longer on this issue's After line.

## Why
A skipped test proves nothing, and today Grain's cross-tool tests and Jarl's real-loop test are skipped wherever nobody supplies the siblings, CI included.

## Acceptance
- Jarl's half, before 313's tag: Jarl's suite run directly with JARL_LIVE_LOOP set, an explicit path and timeout, green with nothing skipped for want of the variable or a sibling, recorded as a --ran/--saw row with its counts
- ws check suites --only grain and --only jarl pass on the 6.2.0 trees, recorded as --ran/--saw with each suite's counts, after the last Grain and Jarl merges and again on the final tips before 224; the issue closes only after this
- A fixture suite with one planted environment skip turns the check red and names the test; a planted platform skip is reported and does not
- Every failure found is filed as an issue with its cause

## Evidence

Ruling mimir-gard-horde-out-of-the-6-2-0-loop: Krzysztof, 2026-11-08 (translated from Polish): "Remove Mimir, Gard and Horde from the release loop, those projects are to be thrown out. Just for tidiness." Every issue of the 6.2.0 loop whose work belongs to Mimir, Gard or Horde is dropped. So are the issues that reach the family through Gard alone (346 to 354, 424, 425) and the Horde test run (254). Issues 224 and 358 lose their Horde part. Another tool's issue that mentions one of the three keeps its own work, and the mention no longer counts. The dropped issues stay on record as history, as horde-leaves-the-family says of loops that name Horde.

