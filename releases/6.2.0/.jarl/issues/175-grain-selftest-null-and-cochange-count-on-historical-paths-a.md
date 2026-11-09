# 175 · Grain: selftest --null and --cochange count on historical paths, and scope co-changes are not deduplicated across renames

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1153-jgnm
**Tags:** grain, cochange
**Files:** Grain/plugins/grain/engine/selftest.mjs, Grain/plugins/grain/engine/cochange.mjs
**Repo:** ../../../Grain
**After:** 048
**Found by:** grain-048
**Where:**
**Branch:** jarl/146-status-selftest-output
**Merged:** 3ed1f82
**CI:** none

## What
After 048 file co-changes follow a rename, but selftest --null and selftest --cochange still count on historical paths, and scope pairs are not merged across renames.

## Why
The self-test and the scope level give different numbers than the file level.

## Acceptance
selftest and scope pairs use the same population as 048; test.

## Changelog
- Fixed: the self-tests and the declaration-level co-change pairs now follow renamed files, so a pair that kept changing together across a rename is counted once with its whole history, the same way file co-change already was.

## Evidence

docs: docs/results.md / docs/validation.md: selftest --null and --cochange figures measured before 6.1.1 counted renamed files under their old paths; re-measure or mark them as pre-6.1.1 where a corpus repository has renames
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2267, pass 2266, fail 0, skipped 1, merge 3ed1f82

