# 570 · Runes: under pnpm a bare import of a workspace member that the importing package does not declare b…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1247-afqa
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-010-opus
**Where:** the review of 010, 553
**Branch:** jarl/550-typescript
**Worker:** w-550-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:37

## What
Runes: under pnpm a bare import of a workspace member that the importing package does not declare binds that member, though pnpm links a member only into packages that declare it (483 kept undeclared imports binding as before). In next-intl 76 SWC test fixtures under packages/swc-plugin-extractor/tests, a package with no dependencies, bind next-intl and next-intl/server, and TypeScript resolves nothing for them even after a build. Before 010 these were silent only because the entry was missing.

## Why


## Acceptance


[test] Under pnpm a bare import of a workspace member that the importing package does not declare binds nothing, as TypeScript resolves nothing for it, while a declared member still binds; next-intl's SWC fixtures stay silent in the corpus, red before and green after · by: npm run check

## Changelog


- in a pnpm workspace a bare import of a workspace package binds only where the importing package, or a project above the file up to the workspace root, declares it; an import from a package that does not declare it (`import { x } from 'lib'` in a package with no dependency on `lib`) gives no edge, as pnpm links nothing there. A workspace that hoists publicly (`shamefully-hoist`, `node-linker=hoisted`, a `public-hoist-pattern`) and npm and yarn workspaces are unchanged. Under pnpm a package's import of its own name has no edge unless the package declares exports, as Node reads it. A consumer's graph can lose edges at such imports, so a relation declared for one of them is reported as having no code behind it (Before you upgrade).

## Reviews
- **approve** · by rev-550-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2010-flzy
  Minor (551): a type-only import whose with clause starts on the line after the specifier (import type { T } from 'lib' then with { 'resolution-mode': 'import' } on the next line) gives two readings of the line, one with the mode and one without, so the edge of the file's own format stays beside the right one; the compiler reads only the mode the attribute names · Minor (551): an attribute list of two entries (resolution-mode beside another key, or resolution-mode twice) is read by Runes as the mode, while the compiler 6.0.3 reports the list and resolves by the file (239 of 7648 rows of my own comparison); such a file does not compile, so a known limitation · Minor (570): under pnpm a package's import of its own name without exports is now silent too, which is right as Node reads it, and the changelog entry does not name it · Note (234, 235): this branch changes nothing for them; line 1 of each, quoted: 'makeResolvePathToFile accepts an optional diagnostics callback (documented in docs/api.md as a minor addition); an unreadable tsconfig/package.json is reported with the file and position; Yggdrasil shows it as a non-blocking warning with the file name; Grain disclosure in relStages; tests.' and 'The Runes resolver accepts an optional file view (exists/read) from the commit tree; Grain and Yggdrasil use it, so edges depend only on the commit's content; tests: a built dist/ directory present or not — the same edges.' are met for the Runes half on release/1.1.0 at e9509e1 (diagnostics and file-view test files 36 of 36, docs/api.md names both), and the Yggdrasil and Grain halves are not in Runes and stay open, so neither issue closes on this approve · Verified: every new test red before its fix and green at 904913f (607: 6062 against 300 ms; 551: 2 fail; 570: 1 fail; 576: 3 fail; 550: 3 disagreements); npm run check tests 2544, pass 2543, fail 0, skipped 1, dist/ is fresh; the merge 1c9c23e: 900 case files, 900 runCase, the count 900, Rust rev 18, TypeScript rev 5, no conflict marker; 551 against the compiler in 34 more spellings over 13 module kinds and 27 defaulted settings: one-line, broken import list, broken attribute braces, trailing comma, mixed quotes, a comment before with, export type * as, an invalid value and the recovery path all agree; 570: of 47 layouts of my own only the undeclared ones changed against the release (a member declared in any of the four fields by workspace:, link: or a path, by a root declaration, under a nested package.json, through an alias, a subpath or tsconfig paths keeps its edge; a commented shamefully-hoist no longer counts as hoisting); 576: 36 rows of a built copy against the compiler (exports and main/module/types, .ts and .tsx sources, nodenext and two bundler settings, .ts, .mts and .cts importers): the compiler binds dist/<name>.d.mts or .d.cts where Runes binds src/<name>, and a .mts source, a committed dist file and noEmit read as described; 607: 135 malformed inputs read the same before and after; corpus over the shared cache: 33 repositories ok, 0 added, 0 removed, react 554 of 554 explained with honest reasons, koa 0 disagreements, strict fails only on the 5 Go and .NET oracles this machine lacks; no test, threshold or guard weakened; one test commit and one fix commit per issue · Tried against the pnpm rule: a commented setting, shamefully-hoist=false, pnpm named only in packageManager, a declaration in a package.json no workspace lists; none got an undeclared member bound or a declared one dropped

## Evidence

### Proof

- **ran (line 363a24171bcd):** node --test test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs at the red commit (four new cases, before the fix) · **saw:** pass 135, fail 1: typescript-workspace-pnpm-undeclared-member-silence: unexpected cross-owner edge packages/plugin/tests/fixture/input.ts:1->lib
- **ran (line 363a24171bcd):** node --test test/relations/extractors/typescript*.test.mjs test/relations/catalogue.test.mjs test/relations/resolve-path.test.mjs test/relations/file-view.test.mjs test/relations/diagnostics.test.mjs at the fix, then the 7 new unit tests of the pnpm rule · **saw:** tests 421, pass 421, fail 0; unit tests pass 7, fail 0 (a declared member binds in each dependency field, a root declaration binds, public hoisting keeps the binding, npm and yarn unchanged)
- **ran (line 363a24171bcd):** RUNES_CORPUS_DIR=<shared cache> node scripts/corpus.mjs gate --only next-intl --strict before and after the golden was rewritten, then gate --tier all --strict · **saw:** before: 76 UNEXPLAINED removed edges, all under packages/swc-plugin-extractor/tests, and 76 explanations of typescript:false-edge at the same sites match nothing; after: 0 added, 0 removed, typescript 1455 checked, 198 disagreements, 198 explained, gate passed; all 33 repositories ok, the strict run fails only on the Go and .NET oracles this machine does not have
- **ran (line 363a24171bcd):** npm run check at 904913f, after release/1.1.0 at e9509e1 was merged into the branch · **saw:** tests 2544, pass 2543, fail 0, skipped 1 (the Go oracle test, go is not installed), dist/ is fresh; npm run coverage 99.18 / 95.69 / 99.20
- **ran (line 363a24171bcd):** node --test test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs in an extraction of a9c4705, then npm run check at 904913f and corpus.mjs gate --tier all --strict over the shared cache · **saw:** at a9c4705 pass 135, fail 1 (typescript-workspace-pnpm-undeclared-member-silence: unexpected cross-owner edge); at 904913f tests 2544, pass 2543, fail 0; next-intl 0 added, 0 removed, 198 disagreements, 198 explained

### Notes

Assumed: a project that declares is the workspace root or a member, in any of the four dependency fields; a package.json no workspace lists does not count. A workspace that hoists publicly (shamefully-hoist true, node-linker hoisted, any public-hoist-pattern, and before pnpm 10 a member whose name holds eslint or prettier) keeps the earlier binding, since pnpm may link the member at the root. A package's import of its own name without exports is silent under pnpm too, as pnpm makes no self link.

