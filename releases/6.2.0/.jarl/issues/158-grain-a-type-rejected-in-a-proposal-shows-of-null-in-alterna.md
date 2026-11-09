# 158 · Grain: a type rejected in a proposal shows 'of: null' in alternatives.md

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1036-plin
**Tags:** grain, propose
**Files:** Grain/plugins/grain/engine/propose-write.mjs
**Repo:** ../../../Grain
**After:** 060
**Found by:** grain-035
**Where:**
**Branch:** jarl/157-propose-followups
**Merged:** be2ca3f
**CI:** none

## What
After 060 a type whose when selects none of its files goes to alternatives as infeasible, but the row shows 'of: null'.

## Why
A reader of the proposal does not know what the rejected alternative was about.

## Acceptance
The row of a rejected type says what it was about; a test.

## Changelog
- Fixed: a type the proposal had to refuse is now listed in alternatives.md with the type it sits inside, or the folder it was cut at, instead of "null".

## Evidence

- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2138, pass 2137, fail 0, skipped 1, merge be2ca3f

