# 183 · Grain: oracle.mjs matches coverage.excluded with glob rules instead of mapping-entry rules and does not skip nested projects

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1250-cnbw
**Tags:** grain, oracle
**Files:** Grain/plugins/grain/engine/oracle.mjs
**Repo:** ../../../Grain
**After:** 054
**Found by:** grain-054
**Where:**
**Branch:** jarl/195-propose-truth
**Merged:** c85cdc9
**CI:** none

## What
After 054 measure decides file ownership as Yggdrasil does (coverage.excluded entries as mapping entries, nested projects without an owner), but oracle.mjs:617 still matches coverage.excluded as globs and does not skip nested projects; grain.mjs:617 passes an unused declaredVia to measure.

## Why
Oracle and measure count over different sets of files.

## Acceptance
oracle uses the same ownership function as measure after 054; the unused parameter removed; test.

## Changelog
- Fixed: grain oracle record leaves out the files the accepted graph leaves out the same way yg check does: excluded paths are read like mapping entries, and nested projects are left out.

## Evidence

tests/oracle-graph-exclusion.test.mjs: red 'oracle counted 8 files, the graph governs 5', green; oracle and measure tests 38 pass 1 skip. Unused declaredVia to cmdMeasure already removed on release/6.1.1 by d3338d6.
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2245, pass 2244, fail 0, skipped 1, merge c85cdc9

