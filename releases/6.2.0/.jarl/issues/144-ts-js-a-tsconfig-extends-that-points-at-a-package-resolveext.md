# 144 · TS/JS: a tsconfig extends that points at a package (resolveExtends) still uses the index of all package.json files, so a fixture with that name can capture it

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0952-yruc
**Tags:** runes, typescript
**Files:** Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** ../../../Runes
**After:** 012
**Found by:** runes-010
**Where:**
**Branch:** jarl/144-ts-followups
**Merged:** bdc69a9 in ../../../Runes
**CI:** none

## What
After 012 a bare import name binds only to members of the declared workspace, but resolveExtends (a tsconfig extends that points at a package) still uses the index of all package.json files in the repo. A test fixture named after the base config's package can take over the extends.

## Why
The same kind of bug as 012 in another place: a config read from the wrong file changes paths and baseUrl for the whole package.

## Acceptance
resolveExtends applies the same membership rule as 012; a case with a same-named fixture red before, green after.

## Changelog
- Fixed: a tsconfig extends that names a package ("extends": "@acme/tsconfig") binds by the same workspace rule as a bare import, so a test fixture carrying that name is never read as the base config and no longer hides the workspace member's paths.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1673, pass 1673, fail 0, catalogue 505 cases, dist/ is fresh; npm run coverage: tests 1673, pass 1673, fail 0, all files 98.76 / 94.22 / 98.78, exit 0; merge bdc69a9 (catalogue count conflict resolved to 501 + 4 = 505; rebuilt dist matches)

