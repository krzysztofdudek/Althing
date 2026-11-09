# 152 · Grain: the stress tool tests/stress/propose.mjs compares paths only as text (the same weakness as 037)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1010-fhdl
**Tags:** grain, tests
**Files:** Grain/plugins/grain/tests/stress/propose.mjs
**Repo:** ../../../Grain
**After:** 037
**Found by:** grain-037
**Where:**
**Branch:** jarl/195-propose-truth
**Merged:** c85cdc9
**CI:** none

## What
After 037 propose compares directories by their identity on disk, but the stress tool still compares them as text, so on a case-insensitive system it can write where propose would refuse.

## Why
A test tool should not bypass the protection it tests.

## Acceptance
tests/stress/propose.mjs uses the same comparison as propose.

## Changelog
- Fixed: the proposal measurement tool now refuses to write into the repository or its graph under any spelling, as grain propose does.

## Evidence

tests/stress-propose-out-dir-guard.test.mjs: red 2/2 (symlink and REPO spellings reached the renderer, stopped only by its own grain-mark backstop), green 2/2.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2245, pass 2244, fail 0, skipped 1, merge c85cdc9

