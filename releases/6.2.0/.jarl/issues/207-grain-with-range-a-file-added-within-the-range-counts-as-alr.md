# 207 · Grain: with --range a file added within the range counts as already known, so the recipe lines (missing:) never fire on the CI path

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, check
**Files:** 
**Repo:** ../../../Grain
**Found by:** grain-116
**Where:**
**Branch:** jarl/167-check-truth
**Merged:** 87c0ef3
**CI:** none

## What
Reported by the worker of package 116 while fixing 129.

## Why



## Acceptance
check/review with --range for a file added within the range prints the recipe lines as it does without --range; test red→green.

## Changelog
- Fixed: review with --range now names the missing companion and registration of a file added in that range, as it does for an uncommitted new file.

## Evidence

Red→green: tests/review-range-new-file-recipe.test.mjs 1/3 → 3/3 (commit 0c11824). docs: none.
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2239, pass 2238, fail 0, skipped 1, merge 87c0ef3

