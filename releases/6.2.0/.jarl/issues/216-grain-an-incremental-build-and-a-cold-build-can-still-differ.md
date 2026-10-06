# 216 · Grain: an incremental build and a cold build can still differ when a file is renamed on one branch and the old path is edited on another, and when a side-branch commit is dated before its base

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, history
**Files:** Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**After:** 197
**Found by:** grain-180
**Where:**
**Branch:** jarl/213-groups-cochange-history
**Merged:** c468854
**CI:** none

## What
After 197 the order of value events, the scope life cycle and the example commit for a word do not depend on the walk order for interleaved branches. Two differences remain: (1) a file renamed on one branch and the old path edited on another — moving the scope history to the new path (state.lc/state.vev at event R) works only when the new path does not exist yet, so the result depends on which branch was walked first; (2) a side-branch commit dated before its base (the author's clock set back) — git log without --topo-order can list it before its parent, and replay compares with a parent whose scopes it does not know yet.

## Why
History-based answers depend on when the index was refreshed.

## Acceptance
Both cases have a test that builds the repository incrementally and from scratch and compares H.vev, H.lc and H.msgAffEx; the results are equal.

## Changelog
- Fixed: answers drawn from history no longer depend on when the index was last refreshed when a file was renamed on one branch and edited on another, or when a branch commit carries a date earlier than the commit it was based on.

## Evidence

Both cases reported by the review of 197; the mechanisms described are hypotheses from reading history.mjs, not reproduced by a test.

history-rename-and-skewed-side-branch.test.mjs red (rename: mods 0 at moved.js; skew: first = side commit date) -> green (cold = resumed from main = resumed from side for H.vev, H.lc, H.msgAffEx); split afc8cf0 keeps history.mjs at 49,349/50,000
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2296, pass 2294, fail 0, skipped 2, merge c468854

