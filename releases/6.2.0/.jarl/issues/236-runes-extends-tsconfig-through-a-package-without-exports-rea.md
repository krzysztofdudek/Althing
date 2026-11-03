# 236 · Runes: extends tsconfig through a package without exports reads the tsconfig field in package.json, and extends with a subpath also tries <subpath>/tsconfig.json (split off from 188)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, typescript
**Files:** 
**Repo:** ../../../Runes
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**
**Branch:** jarl/236-ts-extends-and-config-columns
**Merged:** d3580d4ebc1e4507e3239a4c53215d22df8c0e73 in ../../../Runes
**CI:** green

## What
Split off from 188 per the 6.2.0 plan (R5).

## Why



## Acceptance
extends: "@acme/tsconfig" on a package without exports reads the tsconfig field from package.json, then tsconfig.json; extends: "@acme/tsconfig/base" tries base, base.json and base/tsconfig.json; one catalogue case for each form, red→green.

## Changelog
- Fixed: a tsconfig `extends` naming a package with no `exports` now reads the `tsconfig` field of its package.json and then its `tsconfig.json`, and `extends: "@acme/tsconfig/base"` also tries `base/tsconfig.json`, so the `paths` of such a base apply; a graph can show new edges, and no new refusals.

## Evidence


- **ran:** node --test test/relations/extractors/typescript-name-resolution-matrix.test.mjs (resolver held at release/1.1.0) · **saw:** pass 83, fail 2: typescript-tsconfig-extends-package-field-edge and typescript-tsconfig-extends-subpath-directory-edge
- **ran:** same file with the fix, plus catalogue.test.mjs (580 cases) · **saw:** pass 88, fail 0; npm run check green (1918 pass), npm run coverage over thresholds (99.04 lines, 94.71 branches, 99.12 functions)
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** tests 1918, pass 1918, fail 0; dist/ is fresh (merge d3580d4ebc1e4507e3239a4c53215d22df8c0e73 on release/1.1.0)

