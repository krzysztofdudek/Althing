# 146 · Grain: grain status does not account for expired placement suggestions

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, hooks
**Files:** Grain/plugins/grain/bin/grain-report.mjs
**Repo:** ../../../Grain
**After:** 057, 109
**Found by:** grain-057
**Where:**
**Branch:** jarl/146-status-selftest-output
**Merged:** 3ed1f82
**CI:** none

## What
An expired placement suggestion is accounted as 'deviated' only at the next write hook; grain status does not account for it, so the report shows stale counts until the agent writes something.

## Why
The report on how effective the suggestions are depends on whether any write followed the expiry.

## Acceptance
grain status accounts for expired suggestions the same way the write hook does; a test.

## Changelog
- Fixed: grain status now counts placement suggestions that expired without being followed, instead of waiting for the next file write to update the figure.

## Evidence

- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2267, pass 2266, fail 0, skipped 1, merge 3ed1f82

