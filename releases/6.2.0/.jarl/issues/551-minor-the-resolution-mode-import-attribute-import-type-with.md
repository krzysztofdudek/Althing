# 551 · Minor: the resolution-mode import attribute (import type ... with { 'resolution-mode': 'import' }, …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1042-xchh
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-526-opus
**Where:** the review of 491, 526
**Branch:** jarl/550-typescript
**Worker:** w-550-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:37

## What
Minor: the resolution-mode import attribute (import type ... with { 'resolution-mode': 'import' }, and the same in an import type node) overrides the mode in TypeScript, and Runes ignores it; it existed before this change.

## Why


## Acceptance


[test] An import type and an import type node carrying the resolution-mode attribute read the require or import condition the attribute names, as TypeScript does, a catalogue case each, red before and green after · by: npm run check

## Changelog
- Added: the `resolution-mode` import attribute decides the `exports` condition, as TypeScript reads it: `import type { T } from 'x' with { 'resolution-mode': 'import' }`, a type-only re-export with the attribute and an import type `import('x', { with: { 'resolution-mode': 'require' } }).T` read the condition the attribute names whatever their file's format; the path hint's `callForm` gains the value `'esm'` for it, and the TypeScript extractor's `rev` is 5, so hints stored by an earlier build are stale.

## Evidence

### Proof

- **ran (line 933fc1981d1c):** node --test --test-name-pattern=resolution-mode test/relations/extractors/typescript-conditions-compiler.test.mjs, and the two new catalogue cases through typescript-name-resolution-matrix.test.mjs, on the source before the fix · **saw:** compiler comparison: pass 0, fail 2, 400 rows differ, every one a type-only form with the attribute; catalogue cases typescript-exports-resolution-mode-type-only-import-edge and typescript-exports-resolution-mode-import-type-edge: pass 0, fail 2
- **ran (line 933fc1981d1c):** node --test test/exports.test.mjs test/relations/extractors/typescript*.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/resolver.test.mjs test/relations/resolve-path.test.mjs at the fix · **saw:** tests 461, pass 461, fail 0 (the compiler comparison of 34 attribute spellings in 13 module kinds and 20 defaulted settings among them)
- **ran (line 933fc1981d1c):** npm run check at 904913f, after release/1.1.0 at e9509e1 was merged into the branch · **saw:** tests 2544, pass 2543, fail 0, skipped 1 (the Go oracle test, go is not installed), dist/ is fresh; npm run coverage 99.18 / 95.69 / 99.20

### Notes

Assumed: the mode travels in the existing callForm field of the path hint instead of a new field: 'require' for resolution-mode require (it reads exactly as a require() call does) and a new third value 'esm' for resolution-mode import, because callForm 'import' means a dynamic import() that the compiler may emit as a require. Consumers that pass the hint's callForm through to resolvePathToFile need no change; docs/api.md describes the value. The catalogue goes 869 to 871 and the TypeScript rev 4 to 5.

