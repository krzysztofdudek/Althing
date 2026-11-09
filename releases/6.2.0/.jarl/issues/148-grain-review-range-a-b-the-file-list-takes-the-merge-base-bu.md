# 148 · Grain: review --range a...b — the file list takes the merge-base, but the per-file diffs compare a with b directly

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0956-wmll
**Tags:** grain, review
**Files:** Grain/plugins/grain/engine/grain-check.mjs
**Repo:** ../../../Grain
**After:** 036
**Found by:** grain-036
**Where:**
**Branch:** jarl/145-cli-followups
**Merged:** f1f919b
**CI:** none

## What
For a three-dot range the list of changed files has git's meaning (from the merge-base), but the diffs of individual files compare a with b directly, so lines from the base branch can end up in 'your change'.

## Why
Review and check attribute to a change lines it did not introduce when the base has moved forward.

## Acceptance
For a...b the file list and the diffs count from the same merge-base; a test with a base that has moved forward.

## Changelog
- Fixed: check and review with a three-dot range (a...b) no longer count lines the base branch changed after the fork as part of your change.

## Evidence

red: tests/review-range-merge-base.test.mjs on the unfixed engine: 2 fail (check a.ts --range base...feature printed 3 deviations in your change; review listed the file with 3). green after 06ac635: 4/4, plus review-range-not-an-option and check-range-contract 48/48 alongside. docs: docs/reference.md rows check/review: may add that <a>...<b> counts from the merge base, as in git
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2128, pass 2127, fail 0, skipped 1, merge f1f919b

