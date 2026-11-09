# 197 · Grain: the order of vev and msgAffEx events depends on the walk order, so an incremental build and a cold build can differ with interleaved branches

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1644-ayss
**Tags:** grain, history
**Files:** Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**After:** 108
**Found by:** grain-062
**Where:**
**Branch:** jarl/180-scopes-and-history
**Merged:** 77473cb
**CI:** none

## What
After 108 replay compares a commit with its parent, but the order of vev and msgAffEx events still follows the walk order, so with interleaved branches an incremental build can differ from a cold one.

## Why
Results that depend on when the index was refreshed.

## Acceptance
The order of these events is deterministic with respect to the commit graph; a test with interleaved branches: incremental = cold.

## Changelog
- Fixed: when a side branch whose commits interleave in time with the main line is merged, refreshing the index step by step now gives the same history for functions edited or created on both lines (the order of their changes, their first and last dates, and the example commit for a word) as building it from scratch.

## Evidence

commits 6773f12 + 3c060d9: tests/history-order-interleaved-branches.test.mjs red before (incremental vs cold differ on a.js#method#f event order and msgAffEx widget example), green after; history helpers moved to engine/history-order.mjs (history.mjs reviewer budget), published msgAffinity ex stays [sha, msg]. Not fixed (outside the two named structures): lc.first is first-walked, and a scope born independently on two interleaved lines keeps only the first-walked birth event — incremental and cold still differ there (probed).

commit 8a0b33a: lifecycle (first, last, churn, newFile) and births on both interleaved lines are walk-order independent; test extended with c.js h() born on both lines; red before (h birth events 1 vs 2), green after. docs/mathematics.md numeric register row updated in the same commit (register test).
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2279, pass 2278, fail 0, skipped 1, merge 77473cb

