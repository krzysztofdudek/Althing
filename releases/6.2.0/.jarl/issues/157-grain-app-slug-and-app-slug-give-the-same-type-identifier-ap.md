# 157 · Grain: app/[...slug] and app/[[...slug]] give the same type identifier app-slug; the partition and module types do not check for duplicates

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T1036-uwnp
**Tags:** grain, propose
**Files:** Grain/plugins/grain/engine/propose.mjs
**Repo:** ../../../Grain
**After:** 060
**Found by:** grain-035
**Where:**
**Branch:** jarl/157-propose-followups
**Merged:** be2ca3f
**CI:** none

## What
After 060 directories with brackets are mapped literally, but the type identifier is made from the name without special characters, so app/[...slug] and app/[[...slug]] both give 'app-slug'. Lower-level types check for a collision; the partition and module types do not.

## Why
Two types with one identifier: one overwrites the other, or the proposal is rejected on adoption.

## Acceptance
A collision of type identifiers is resolved deterministically (a unique suffix) at every level; a test with both Next.js directories.

## Changelog
- Fixed: two route folders whose names differ only in brackets, such as app/[...slug] and app/[[...slug]], now become two types in a proposal instead of one silently replacing the other.

## Evidence

jarl: the finer level adds a type with a suffix instead of rejecting the colliding directory — accepted (the acceptance requires unique ids at every level)
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2138, pass 2137, fail 0, skipped 1, merge be2ca3f

