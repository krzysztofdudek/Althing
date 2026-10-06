# 276 · Compatibility: Grain's full gate and Jarl's suite in the workspace's environment, failing on any test skipped for want of a sibling (with 254, package W2)

**Status:** open
**Kind:** test
**Priority:** 1
**Tier:** standard
**Tags:** compatibility, grain, jarl, workspace
**Files:** Althing/workspace/checks/suites.mjs
**Repo:** ../..
**Found by:** jarl
**Where:** Althing/workspace/checks/suites.mjs (planned with 254); Grain's tests read YG_BIN, HORDE_DIR and GRAIN_CORPUS_CLONES and skip without them; Jarl's real-loop test (skills/jarl/scripts/tests/resume.test.mjs) skips without JARL_LIVE_LOOP
**After:** 275

## What
Package W2 of the workspace design runs every tool's suite in the full environment, not only Horde's (254). Grain's full gate (cd plugins/grain && npm test, with YG_BIN, HORDE_DIR and GRAIN_CORPUS_CLONES from ws env) and Jarl's suite (cd skills/jarl/scripts && npm test, with JARL_LIVE_LOOP) run from the 6.2.0 trees. The check parses each suite's output and fails on a test skipped for an environment reason; a test skipped for a platform is reported, not failed.

## Why
A skipped test proves nothing, and today Grain's cross-tool tests and Jarl's real-loop test are skipped wherever nobody supplies the siblings, CI included.

## Acceptance
- ws check suites --only grain and --only jarl pass on the 6.2.0 trees, recorded as --ran/--saw with each suite's counts, after the last Grain and Jarl merges and again on the final tips before 224
- A fixture suite with one planted environment skip turns the check red and names the test; a planted platform skip is reported and does not
- Every failure found is filed as an issue with its cause

## Evidence

