# 172 · Grain: a rule id from propose does not include the declaration kind, so a PascalCase rule for classes and a camelCase rule for methods in the same area collide and the second silently disappears

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T1139-zcxd
**Tags:** grain, propose
**Files:** Grain/plugins/grain/engine/propose-aspects.mjs
**Repo:** ../../../Grain
**After:** 046
**Found by:** rev-grain-046
**Where:**
**Branch:** jarl/157-propose-followups
**Merged:** be2ca3f
**CI:** none

## What
propose-aspects.mjs:437-438 builds the rule id without the declaration kind. When one part of the code has a PascalCase rule for classes and a camelCase rule for methods, the second is silently dropped from the proposal. Reproduced on a TypeScript repo; it existed before 046, and after 046 it is easier to hit.

## Why
The proposal loses a real convention without a trace.

## Acceptance
The rule id distinguishes the declaration kind; both rules reach the proposal; a test on a repo with classes and methods.

## Changelog
- Fixed: when one part of the code names its classes one way and its methods another (PascalCase and camelCase), a proposal now carries both naming rules instead of silently keeping only one.

## Evidence

- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2138, pass 2137, fail 0, skipped 1, merge be2ca3f

