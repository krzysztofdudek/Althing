# 159 · Grain: the type evidence comment in propose-write.mjs:138 prints the glob unescaped

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, propose
**Files:** Grain/plugins/grain/engine/propose-write.mjs
**Repo:** ../../../Grain
**After:** 060, 037
**Found by:** grain-035
**Where:**
**Branch:** jarl/157-propose-followups
**Merged:** be2ca3f
**CI:** none

## What
After 060 all globs written to when are escaped, but the type evidence comment (propose-write.mjs:138) still shows the raw path with brackets.

## Why
Cosmetic, but a reader may copy the glob from the comment.

## Acceptance
The comment shows the same glob that goes into when.

## Changelog
- Fixed: the note above each proposed type now quotes the same pattern the type uses, so copying it from a folder like app/[locale] gives a pattern that matches that folder.

## Evidence

- **ran:** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2138, pass 2137, fail 0, skipped 1, merge be2ca3f

