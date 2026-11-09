# 178 · TS/JS: extends in tsconfig pointing at a package does not read the package's exports field

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1228-nyvi
**Tags:** runes, typescript
**Files:** Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** ../../../Runes
**After:** 144
**Found by:** runes-144
**Where:**
**Branch:** jarl/168-last-runes
**Merged:** 6ef3ef9 in ../../../Runes
**CI:** none

## What
resolveExtends with a package name does not honour the exports map in the base package's package.json (tsc reads it since 5.0), so a base config exposed through exports is not found. Behaviour from before the patch.

## Why
A base config from a shared package (e.g. @org/tsconfig/base) is not read, so the paths from it do not work.

## Acceptance
extends with a package name resolves through exports as in tsc; a test compared with tsc.

## Changelog
- Fixed: a tsconfig `extends` naming a package reads the package's `exports` as tsc 5.0+ does (conditions require, types, node, default; patterns; a package whose exports name no file passes the lookup to the next node_modules), so a base published under another path is found and a leftover tsconfig.json beside the package.json is no longer read in its place.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1736, pass 1736, fail 0, catalogue 522 cases, dist/ is fresh; npm run coverage: tests 1736, pass 1736, fail 0, all files 98.81 / 94.49 / 98.80, exit 0; merge 6ef3ef9 (clean merge, branch based on the release tip; 522 = 516 + 6 matches the cases on disk)

