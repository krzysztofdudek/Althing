# 215 · Grain: the fallback path for counting co-changes can give a confidence above 1; no test of a rename chain and of a return to an old name

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261003T1004-izkl
**Tags:** grain, cochange
**Files:** 
**Repo:** ../../../Grain
**Found by:** rev-grain-146
**Where:**
**Branch:** jarl/213-groups-cochange-history
**Merged:** c468854
**CI:** none

## What
The reviewer of package 146 (175): the fallback path, unused in practice, can return confidence > 1; commits older than the kept window are not deduplicated across renames; the suite has no test of a rename chain or of a return to an old name.

## Why



## Acceptance
Co-change confidence never exceeds 1 on any path; tests of a rename chain and of a return to an old name.

## Changelog
- Fixed: two declarations that change together are never reported as changing together more often than one of them changes, including across renamed files.

## Evidence

cochange-confidence-bounded.test.mjs: conf 2 on both carrying paths (red) -> bounded at 1 (green); chain and rename-back tests green
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2296, pass 2294, fail 0, skipped 2, merge c468854

