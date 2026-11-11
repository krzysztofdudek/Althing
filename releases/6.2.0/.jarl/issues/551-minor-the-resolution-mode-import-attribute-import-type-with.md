# 551 · Minor: the resolution-mode import attribute (import type ... with { 'resolution-mode': 'import' }, …

**Status:** done
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
**Merged:** 20c34d8
**Merge check:** npm run check · saw tests 2544, pass 2543, fail 0, skipped 1; catalogue 900 equals the case files; dist fresh after the commit

## What
Minor: the resolution-mode import attribute (import type ... with { 'resolution-mode': 'import' }, and the same in an import type node) overrides the mode in TypeScript, and Runes ignores it; it existed before this change.

## Why


## Acceptance


[test] An import type and an import type node carrying the resolution-mode attribute read the require or import condition the attribute names, as TypeScript does, a catalogue case each, red before and green after · by: npm run check

## Changelog
- Added: the `resolution-mode` import attribute decides the `exports` condition, as TypeScript reads it: `import type { T } from 'x' with { 'resolution-mode': 'import' }`, a type-only re-export with the attribute and an import type `import('x', { with: { 'resolution-mode': 'require' } }).T` read the condition the attribute names whatever their file's format; the path hint's `callForm` gains the value `'esm'` for it, and the TypeScript extractor's `rev` is 5, so hints stored by an earlier build are stale.

## Reviews
- **approve** · by rev-550-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2010-flzy
  Minor (551): a type-only import whose with clause starts on the line after the specifier (import type { T } from 'lib' then with { 'resolution-mode': 'import' } on the next line) gives two readings of the line, one with the mode and one without, so the edge of the file's own format stays beside the right one; the compiler reads only the mode the attribute names · Minor (551): an attribute list of two entries (resolution-mode beside another key, or resolution-mode twice) is read by Runes as the mode, while the compiler 6.0.3 reports the list and resolves by the file (239 of 7648 rows of my own comparison); such a file does not compile, so a known limitation · Minor (570): under pnpm a package's import of its own name without exports is now silent too, which is right as Node reads it, and the changelog entry does not name it · Note (234, 235): this branch changes nothing for them; line 1 of each, quoted: 'makeResolvePathToFile accepts an optional diagnostics callback (documented in docs/api.md as a minor addition); an unreadable tsconfig/package.json is reported with the file and position; Yggdrasil shows it as a non-blocking warning with the file name; Grain disclosure in relStages; tests.' and 'The Runes resolver accepts an optional file view (exists/read) from the commit tree; Grain and Yggdrasil use it, so edges depend only on the commit's content; tests: a built dist/ directory present or not — the same edges.' are met for the Runes half on release/1.1.0 at e9509e1 (diagnostics and file-view test files 36 of 36, docs/api.md names both), and the Yggdrasil and Grain halves are not in Runes and stay open, so neither issue closes on this approve · Verified: every new test red before its fix and green at 904913f (607: 6062 against 300 ms; 551: 2 fail; 570: 1 fail; 576: 3 fail; 550: 3 disagreements); npm run check tests 2544, pass 2543, fail 0, skipped 1, dist/ is fresh; the merge 1c9c23e: 900 case files, 900 runCase, the count 900, Rust rev 18, TypeScript rev 5, no conflict marker; 551 against the compiler in 34 more spellings over 13 module kinds and 27 defaulted settings: one-line, broken import list, broken attribute braces, trailing comma, mixed quotes, a comment before with, export type * as, an invalid value and the recovery path all agree; 570: of 47 layouts of my own only the undeclared ones changed against the release (a member declared in any of the four fields by workspace:, link: or a path, by a root declaration, under a nested package.json, through an alias, a subpath or tsconfig paths keeps its edge; a commented shamefully-hoist no longer counts as hoisting); 576: 36 rows of a built copy against the compiler (exports and main/module/types, .ts and .tsx sources, nodenext and two bundler settings, .ts, .mts and .cts importers): the compiler binds dist/<name>.d.mts or .d.cts where Runes binds src/<name>, and a .mts source, a committed dist file and noEmit read as described; 607: 135 malformed inputs read the same before and after; corpus over the shared cache: 33 repositories ok, 0 added, 0 removed, react 554 of 554 explained with honest reasons, koa 0 disagreements, strict fails only on the 5 Go and .NET oracles this machine lacks; no test, threshold or guard weakened; one test commit and one fix commit per issue · Tried against the pnpm rule: a commented setting, shamefully-hoist=false, pnpm named only in packageManager, a declaration in a package.json no workspace lists; none got an undeclared member bound or a declared one dropped

## Evidence

### Proof

- **ran (line 933fc1981d1c):** node --test --test-name-pattern=resolution-mode test/relations/extractors/typescript-conditions-compiler.test.mjs, and the two new catalogue cases through typescript-name-resolution-matrix.test.mjs, on the source before the fix · **saw:** compiler comparison: pass 0, fail 2, 400 rows differ, every one a type-only form with the attribute; catalogue cases typescript-exports-resolution-mode-type-only-import-edge and typescript-exports-resolution-mode-import-type-edge: pass 0, fail 2
- **ran (line 933fc1981d1c):** node --test test/exports.test.mjs test/relations/extractors/typescript*.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/resolver.test.mjs test/relations/resolve-path.test.mjs at the fix · **saw:** tests 461, pass 461, fail 0 (the compiler comparison of 34 attribute spellings in 13 module kinds and 20 defaulted settings among them)
- **ran (line 933fc1981d1c):** npm run check at 904913f, after release/1.1.0 at e9509e1 was merged into the branch · **saw:** tests 2544, pass 2543, fail 0, skipped 1 (the Go oracle test, go is not installed), dist/ is fresh; npm run coverage 99.18 / 95.69 / 99.20
- **ran (line 933fc1981d1c):** node --test --test-name-pattern=resolution-mode test/relations/extractors/typescript-conditions-compiler.test.mjs in an extraction of f5d88bb, then npm run check at 904913f · **saw:** at f5d88bb pass 0, fail 2; at 904913f tests 2544, pass 2543, fail 0, skipped 1

### Notes

Assumed: the mode travels in the existing callForm field of the path hint instead of a new field: 'require' for resolution-mode require (it reads exactly as a require() call does) and a new third value 'esm' for resolution-mode import, because callForm 'import' means a dynamic import() that the compiler may emit as a require. Consumers that pass the hint's callForm through to resolvePathToFile need no change; docs/api.md describes the value. The catalogue goes 869 to 871 and the TypeScript rev 4 to 5.

