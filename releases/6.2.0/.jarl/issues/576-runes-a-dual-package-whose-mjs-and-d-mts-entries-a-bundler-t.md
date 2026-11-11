# 576 · Runes: a dual package whose .mjs and .d.mts entries a bundler (tsup, unbuild) builds from a .ts sou…

**Status:** done
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
**Merged:** 20c34d8
**Merge check:** npm run check · saw tests 2544, pass 2543, fail 0, skipped 1; catalogue 900 equals the case files; dist fresh after the commit

## What
Runes: a dual package whose .mjs and .d.mts entries a bundler (tsup, unbuild) builds from a .ts source maps to nothing, because the outDir mapping follows the compiler's extension rule (.d.mts from .mts). An ES importer whose settings are known gets no edge and package-entry-missing although the source is there; in a probe 22 of 480 rows (an app with module esnext and moduleResolution bundler over an unread preset, module nodenext, a committed node16 preset, a readable bundler base), where the compiler after the build binds dist/index.d.mts, emitted from src/index.ts. Unchanged by round 1 of 010; ruling D8 makes it silence rather than a wrong edge.

## Why


## Acceptance


[test] A dual package whose .mjs and .d.mts entries a bundler builds from a .ts source maps those entries back to that source, so an ES importer gets its edge and no package-entry-missing, red before and green after · by: npm run check

## Changelog
- Fixed: a dual package whose `exports`, `module`, `main` or `types` name `dist/index.mjs`, `dist/index.d.mts`, `dist/index.cjs` or `dist/index.d.cts` that a bundler (tsup, unbuild) builds from `src/index.ts` now maps those entries back to that source, so `import { x } from '@acme/core'` gets its edge and the package is no longer reported with `package-entry-missing`; a `.mts` or `.cts` source of the same name is still read first. A consumer's graph can show new edges for such imports (Before you upgrade).

## Reviews
- **approve** · by rev-550-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2010-flzy
  Minor (551): a type-only import whose with clause starts on the line after the specifier (import type { T } from 'lib' then with { 'resolution-mode': 'import' } on the next line) gives two readings of the line, one with the mode and one without, so the edge of the file's own format stays beside the right one; the compiler reads only the mode the attribute names · Minor (551): an attribute list of two entries (resolution-mode beside another key, or resolution-mode twice) is read by Runes as the mode, while the compiler 6.0.3 reports the list and resolves by the file (239 of 7648 rows of my own comparison); such a file does not compile, so a known limitation · Minor (570): under pnpm a package's import of its own name without exports is now silent too, which is right as Node reads it, and the changelog entry does not name it · Note (234, 235): this branch changes nothing for them; line 1 of each, quoted: 'makeResolvePathToFile accepts an optional diagnostics callback (documented in docs/api.md as a minor addition); an unreadable tsconfig/package.json is reported with the file and position; Yggdrasil shows it as a non-blocking warning with the file name; Grain disclosure in relStages; tests.' and 'The Runes resolver accepts an optional file view (exists/read) from the commit tree; Grain and Yggdrasil use it, so edges depend only on the commit's content; tests: a built dist/ directory present or not — the same edges.' are met for the Runes half on release/1.1.0 at e9509e1 (diagnostics and file-view test files 36 of 36, docs/api.md names both), and the Yggdrasil and Grain halves are not in Runes and stay open, so neither issue closes on this approve · Verified: every new test red before its fix and green at 904913f (607: 6062 against 300 ms; 551: 2 fail; 570: 1 fail; 576: 3 fail; 550: 3 disagreements); npm run check tests 2544, pass 2543, fail 0, skipped 1, dist/ is fresh; the merge 1c9c23e: 900 case files, 900 runCase, the count 900, Rust rev 18, TypeScript rev 5, no conflict marker; 551 against the compiler in 34 more spellings over 13 module kinds and 27 defaulted settings: one-line, broken import list, broken attribute braces, trailing comma, mixed quotes, a comment before with, export type * as, an invalid value and the recovery path all agree; 570: of 47 layouts of my own only the undeclared ones changed against the release (a member declared in any of the four fields by workspace:, link: or a path, by a root declaration, under a nested package.json, through an alias, a subpath or tsconfig paths keeps its edge; a commented shamefully-hoist no longer counts as hoisting); 576: 36 rows of a built copy against the compiler (exports and main/module/types, .ts and .tsx sources, nodenext and two bundler settings, .ts, .mts and .cts importers): the compiler binds dist/<name>.d.mts or .d.cts where Runes binds src/<name>, and a .mts source, a committed dist file and noEmit read as described; 607: 135 malformed inputs read the same before and after; corpus over the shared cache: 33 repositories ok, 0 added, 0 removed, react 554 of 554 explained with honest reasons, koa 0 disagreements, strict fails only on the 5 Go and .NET oracles this machine lacks; no test, threshold or guard weakened; one test commit and one fix commit per issue · Tried against the pnpm rule: a commented setting, shamefully-hoist=false, pnpm named only in packageManager, a declaration in a package.json no workspace lists; none got an undeclared member bound or a declared one dropped

## Evidence

### Proof

- **ran (line 3ee1f6c6fde3):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs at the red commit (before the fix) · **saw:** pass 305, fail 3: catalogue case typescript-package-entry-outdir-bundler-dual-edge 'expected edge packages/app/main.ts:1->src not emitted (got none)', the unit test of the four extensions 'expected undefined to be packages/core/src/index.ts', and the package-entry-missing test for a dual package
- **ran (line 3ee1f6c6fde3):** node --test test/relations/extractors/typescript*.test.mjs test/relations/catalogue.test.mjs test/relations/resolve-path.test.mjs test/relations/file-view.test.mjs test/relations/diagnostics.test.mjs test/exports.test.mjs at the fix · **saw:** tests 449, pass 449, fail 0
- **ran (line 3ee1f6c6fde3):** TypeScript 6.0.3 createProgram (module nodenext) over a built copy of the catalogue case, dist/index.d.mts and dist/index.d.cts written; then RUNES_CORPUS_DIR=<shared cache> node scripts/corpus.mjs gate --tier all, and gate --only zod --strict after the golden was rewritten · **saw:** the compiler binds packages/core/dist/index.d.mts for main.ts and packages/core/dist/index.d.cts for legacy.cts; corpus: zod 12 added, 0 removed (all .cts importers, to packages/zod/src and packages/mini/src), its diagnostics 2 to 0, every other repository 0 added, 0 removed; zod after: 0 added, 0 removed, 35 disagreements, 35 explained, gate passed
- **ran (line 3ee1f6c6fde3):** npm run check at 904913f, after release/1.1.0 at e9509e1 was merged into the branch · **saw:** tests 2544, pass 2543, fail 0, skipped 1 (the Go oracle test, go is not installed), dist/ is fresh; npm run coverage 99.18 / 95.69 / 99.20
- **ran (line 3ee1f6c6fde3):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs in an extraction of 1a696fb, then npm run check at 904913f and the corpus gate · **saw:** at 1a696fb pass 305, fail 3 (the catalogue case, the four extensions, package-entry-missing for a dual package); at 904913f tests 2544, pass 2543, fail 0; zod 0 added, 0 removed, 35 disagreements, 35 explained

### Notes

Assumed: the bundler reading stays inside the existing outDir mapping (a tsconfig of the package must place the entry under its outDir, and one with noEmit is still not asked), covers .cjs and .d.cts beside .mjs and .d.mts, and yields to the compiler's own source: with src/a.mts and src/a.ts both there, dist/a.mjs names a.mts.

