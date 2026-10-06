# 171 · Grain: a single all-caps word (MAX) breaks UPPER_SNAKE_CASE, and names ending in an acronym (isEOF, unwrapP) break camelCase

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, names
**Files:** Grain/plugins/grain/engine/shape-fit.mjs
**Repo:** ../../../Grain
**After:** 046
**Found by:** grain-046
**Where:**
**Branch:** jarl/170-name-shapes-and-data-files
**Merged:** 67f86e1
**CI:** none

## What
Name shapes after 046: one-word lowercase names fit every style, but MAX does not fit UPPER_SNAKE_CASE, and isEOF and unwrapP do not fit camelCase.

## Why
False naming-rule violations in real code (one-word constants, acronyms).

## Acceptance
MAX fits UPPER_SNAKE_CASE; names with a trailing acronym fit camelCase under one documented rule; tests.

## Changelog
- Fixed: a one-word constant such as `MAX` no longer breaks an UPPER_SNAKE_CASE rule, and a camelCase name ending in an acronym or a capital (`isEOF`, `unwrapP`) no longer breaks a camelCase rule, in the counts, in `grain check` and in the rules `grain propose` writes.

## Evidence

docs: wherever name-shape fitting is described (with 046's one-word note): a single UPPER word fits UPPER_SNAKE_CASE; a camelCase name may end in a run of capitals (isEOF); PascalCase ending in an acronym is not covered
- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2229, pass 2228, fail 0, skipped 1, merge 67f86e1

