# 170 · Grain: a steer with a one-word name as its example marks the camelCase rule as superseded (learn.mjs:637)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1113-jleq
**Tags:** grain, names
**Files:** Grain/plugins/grain/engine/learn.mjs
**Repo:** ../../../Grain
**After:** 046
**Found by:** grain-046
**Where:**
**Branch:** jarl/170-name-shapes-and-data-files
**Merged:** 67f86e1
**CI:** none

## What
After 046 a one-word name fits camelCase, snake_case and kebab-case at once, but learn.mjs:637 still treats a steer with the example 'helper' as contradicting the camelCase rule and marks the rule as superseded.

## Why
A maintainer's decision can silently switch off a correct rule.

## Acceptance
A steer with a one-word example does not supersede a rule that this example fits; a test.

## Changelog
- Fixed: a steer whose example is a one-word name (such as `helper`) no longer marks the camelCase, snake_case or kebab-case rule that name fits as superseded; it now reads as that rule and its practiced-by share and baseline count it the same way.

## Evidence

rev-grain-046: besides learn.mjs:637, the same comparison without the shape helper sits in decisions.mjs:63 and cards.mjs:334 (the 'practiced by' percentage about 0% with a one-word example) — for the same fix
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2229, pass 2228, fail 0, skipped 1, merge 67f86e1

