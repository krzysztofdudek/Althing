# 576 · Runes: a dual package whose .mjs and .d.mts entries a bundler (tsup, unbuild) builds from a .ts sou…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1312-flla
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-010b-opus
**Where:** the review of 010, 553
**Branch:** jarl/550-typescript
**Worker:** w-550-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:37

## What
Runes: a dual package whose .mjs and .d.mts entries a bundler (tsup, unbuild) builds from a .ts source maps to nothing, because the outDir mapping follows the compiler's extension rule (.d.mts from .mts). An ES importer whose settings are known gets no edge and package-entry-missing although the source is there; in a probe 22 of 480 rows (an app with module esnext and moduleResolution bundler over an unread preset, module nodenext, a committed node16 preset, a readable bundler base), where the compiler after the build binds dist/index.d.mts, emitted from src/index.ts. Unchanged by round 1 of 010; ruling D8 makes it silence rather than a wrong edge.

## Why


## Acceptance


[test] A dual package whose .mjs and .d.mts entries a bundler builds from a .ts source maps those entries back to that source, so an ES importer gets its edge and no package-entry-missing, red before and green after · by: npm run check

## Changelog
- Fixed: a dual package whose `exports`, `module`, `main` or `types` name `dist/index.mjs`, `dist/index.d.mts`, `dist/index.cjs` or `dist/index.d.cts` that a bundler (tsup, unbuild) builds from `src/index.ts` now maps those entries back to that source, so `import { x } from '@acme/core'` gets its edge and the package is no longer reported with `package-entry-missing`; a `.mts` or `.cts` source of the same name is still read first. A consumer's graph can show new edges for such imports (Before you upgrade).

## Evidence

### Proof

- **ran (line 3ee1f6c6fde3):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs at the red commit (before the fix) · **saw:** pass 305, fail 3: catalogue case typescript-package-entry-outdir-bundler-dual-edge 'expected edge packages/app/main.ts:1->src not emitted (got none)', the unit test of the four extensions 'expected undefined to be packages/core/src/index.ts', and the package-entry-missing test for a dual package
- **ran (line 3ee1f6c6fde3):** node --test test/relations/extractors/typescript*.test.mjs test/relations/catalogue.test.mjs test/relations/resolve-path.test.mjs test/relations/file-view.test.mjs test/relations/diagnostics.test.mjs test/exports.test.mjs at the fix · **saw:** tests 449, pass 449, fail 0
- **ran (line 3ee1f6c6fde3):** TypeScript 6.0.3 createProgram (module nodenext) over a built copy of the catalogue case, dist/index.d.mts and dist/index.d.cts written; then RUNES_CORPUS_DIR=<shared cache> node scripts/corpus.mjs gate --tier all, and gate --only zod --strict after the golden was rewritten · **saw:** the compiler binds packages/core/dist/index.d.mts for main.ts and packages/core/dist/index.d.cts for legacy.cts; corpus: zod 12 added, 0 removed (all .cts importers, to packages/zod/src and packages/mini/src), its diagnostics 2 to 0, every other repository 0 added, 0 removed; zod after: 0 added, 0 removed, 35 disagreements, 35 explained, gate passed
- **ran (line 3ee1f6c6fde3):** npm run check at 904913f, after release/1.1.0 at e9509e1 was merged into the branch · **saw:** tests 2544, pass 2543, fail 0, skipped 1 (the Go oracle test, go is not installed), dist/ is fresh; npm run coverage 99.18 / 95.69 / 99.20

### Notes

Assumed: the bundler reading stays inside the existing outDir mapping (a tsconfig of the package must place the entry under its outDir, and one with noEmit is still not asked), covers .cjs and .d.cts beside .mjs and .d.mts, and yields to the compiler's own source: with src/a.mts and src/a.ts both there, dist/a.mjs names a.mts.

