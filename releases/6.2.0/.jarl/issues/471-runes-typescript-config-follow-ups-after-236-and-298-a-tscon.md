# 471 · Runes: TypeScript config follow-ups after 236 and 298 (a tsconfig field naming a missing file, a subpath directory's own package.json, invisible characters left in a resolver test)

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, typescript, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** rev-runes-236-opus
**Where:** Review of 236 and 298 (2026-11-02)
**After:** 236
**Branch:** jarl/471-ts-config-follow-ups
**Worker:** w-runes-471-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/Runes-471
**Since:** 2026-11-02 21:57
**Merged:** 8b975bf in ../../../Runes
**CI:** pending

## What
When a package's tsconfig field names a file that does not exist, the resolver falls back to tsconfig.json, and no test covers it. A subpath directory with a package.json of its own is not read for its tsconfig field the way tsc reads it. test/relations/extractors/typescript-resolve.test.mjs still holds four literal invisible characters.

## Why
An untested fallback can regress silently, a subpath layout tsc accepts loses its aliases, and an invisible character in a test is easy to break by an editor.

## Acceptance
- A test covers the fallback from a missing tsconfig field target to tsconfig.json
- extends through a subpath directory with its own package.json reads that package.json's tsconfig field as tsc does, with a catalogue case red before and green after
- typescript-resolve.test.mjs holds no literal invisible character

## Changelog
- Fixed: a tsconfig `extends` naming a package subpath that is a directory with its own package.json now reads that package.json's `tsconfig` field, as tsc does, so the aliases of the config it names apply and a leftover tsconfig.json beside it no longer does; a graph may show different edges there, not new refusals.

## Evidence

- **ran:** node --test test/relations/extractors/typescript-name-resolution-matrix.test.mjs (new case, before the fix) · **saw:** 1 failed: expected edge packages/app/main.ts:1->ui not emitted (got packages/app/main.ts:1->legacy)
- **ran:** node --test typescript-name-resolution-matrix, catalogue and typescript-resolve tests (after the fix) · **saw:** 201 pass, 0 fail
- **ran:** node --test test/relations/extractors/typescript-resolve.test.mjs (3 new fallback tests) · **saw:** 112 pass, 0 fail; the fallback already worked, so these are coverage of existing behaviour (no red run)
- **ran:** npm run check; npm run coverage · **saw:** check green with dist fresh; coverage 99.05 lines, 94.77 branches, 99.13 functions, 1930 tests, 0 fail
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** tests 1946, pass 1946, fail 0; dist/ is fresh (on 86bd33b, the merge of 295 over the merge of 471 at 8b975bf; catalogue 596)

