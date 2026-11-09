# 471 · Runes: TypeScript config follow-ups after 236 and 298 (a tsconfig field naming a missing file, a subpath directory's own package.json, invisible characters left in a resolver test)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261102T2152-ubdh
**Tags:** runes, typescript, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**Found by:** rev-runes-236-opus
**Where:** Review of 236 and 298 (2026-11-02)
**After:** 236
**Branch:** jarl/471-ts-config-follow-ups
**Merged:** 8b975bf in ../../../Runes
**CI:** red

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

- **ran (history):** node --test test/relations/extractors/typescript-name-resolution-matrix.test.mjs (new case, before the fix) · **saw:** 1 failed: expected edge packages/app/main.ts:1->ui not emitted (got packages/app/main.ts:1->legacy)
- **ran (history):** node --test typescript-name-resolution-matrix, catalogue and typescript-resolve tests (after the fix) · **saw:** 201 pass, 0 fail
- **ran (history):** node --test test/relations/extractors/typescript-resolve.test.mjs (3 new fallback tests) · **saw:** 112 pass, 0 fail; the fallback already worked, so these are coverage of existing behaviour (no red run)
- **ran (history):** npm run check; npm run coverage · **saw:** check green with dist fresh; coverage 99.05 lines, 94.77 branches, 99.13 functions, 1930 tests, 0 fail
- **ran (history):** nice -n 15 timeout 1800 npm run check · **saw:** tests 1946, pass 1946, fail 0; dist/ is fresh (on 86bd33b, the merge of 295 over the merge of 471 at 8b975bf; catalogue 596)

CI on 86bd33b (the merge tip carrying 471 and 295) was red on the Windows Node 22 job only, from the property test's tool-name collision on seed 1328475926, unrelated to either issue; filed and fixed as 478; every later tip containing both, from d0af17c on, is green

