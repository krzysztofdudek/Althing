# 550 · Minor: scripts/corpus.mjs:581 resolves a file no tsconfig covers with Node10, which ignores exports…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1042-pzbh
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
Minor: scripts/corpus.mjs:581 resolves a file no tsconfig covers with Node10, which ignores exports, so the TypeScript oracle cannot check the exports reading Runes now applies to such files (react keeps 94 explained mismatches); an oracle that resolves those files as Node16 or Bundler would check it.

## Why


## Acceptance


[test] The corpus's TypeScript oracle resolves a file no tsconfig covers with a resolution that reads exports (Node16 or Bundler), so react's explained mismatches from that cause are checked rather than explained, red before and green after · by: npm run check

## Reviews
- **approve** · by rev-550-fable (fresh) · 2026-11-11 · model claude-fable-5-2 · batch 20261111T2010-flzy
  Minor (551): a type-only import whose with clause starts on the line after the specifier (import type { T } from 'lib' then with { 'resolution-mode': 'import' } on the next line) gives two readings of the line, one with the mode and one without, so the edge of the file's own format stays beside the right one; the compiler reads only the mode the attribute names · Minor (551): an attribute list of two entries (resolution-mode beside another key, or resolution-mode twice) is read by Runes as the mode, while the compiler 6.0.3 reports the list and resolves by the file (239 of 7648 rows of my own comparison); such a file does not compile, so a known limitation · Minor (570): under pnpm a package's import of its own name without exports is now silent too, which is right as Node reads it, and the changelog entry does not name it · Note (234, 235): this branch changes nothing for them; line 1 of each, quoted: 'makeResolvePathToFile accepts an optional diagnostics callback (documented in docs/api.md as a minor addition); an unreadable tsconfig/package.json is reported with the file and position; Yggdrasil shows it as a non-blocking warning with the file name; Grain disclosure in relStages; tests.' and 'The Runes resolver accepts an optional file view (exists/read) from the commit tree; Grain and Yggdrasil use it, so edges depend only on the commit's content; tests: a built dist/ directory present or not — the same edges.' are met for the Runes half on release/1.1.0 at e9509e1 (diagnostics and file-view test files 36 of 36, docs/api.md names both), and the Yggdrasil and Grain halves are not in Runes and stay open, so neither issue closes on this approve · Verified: every new test red before its fix and green at 904913f (607: 6062 against 300 ms; 551: 2 fail; 570: 1 fail; 576: 3 fail; 550: 3 disagreements); npm run check tests 2544, pass 2543, fail 0, skipped 1, dist/ is fresh; the merge 1c9c23e: 900 case files, 900 runCase, the count 900, Rust rev 18, TypeScript rev 5, no conflict marker; 551 against the compiler in 34 more spellings over 13 module kinds and 27 defaulted settings: one-line, broken import list, broken attribute braces, trailing comma, mixed quotes, a comment before with, export type * as, an invalid value and the recovery path all agree; 570: of 47 layouts of my own only the undeclared ones changed against the release (a member declared in any of the four fields by workspace:, link: or a path, by a root declaration, under a nested package.json, through an alias, a subpath or tsconfig paths keeps its edge; a commented shamefully-hoist no longer counts as hoisting); 576: 36 rows of a built copy against the compiler (exports and main/module/types, .ts and .tsx sources, nodenext and two bundler settings, .ts, .mts and .cts importers): the compiler binds dist/<name>.d.mts or .d.cts where Runes binds src/<name>, and a .mts source, a committed dist file and noEmit read as described; 607: 135 malformed inputs read the same before and after; corpus over the shared cache: 33 repositories ok, 0 added, 0 removed, react 554 of 554 explained with honest reasons, koa 0 disagreements, strict fails only on the 5 Go and .NET oracles this machine lacks; no test, threshold or guard weakened; one test commit and one fix commit per issue · Tried against the pnpm rule: a commented setting, shamefully-hoist=false, pnpm named only in packageManager, a declaration in a package.json no workspace lists; none got an undeclared member bound or a declared one dropped

## Evidence

### Proof

- **ran (line 234b4bce741c):** node --test --test-name-pattern='no tsconfig covers' test/corpus.test.mjs at 95f867a, the oracle as on release/1.1.0 (before the fix) · **saw:** fail 1: FAIL conditions, checked: typescript 5; 2 disagreements, 0 explained: typescript:mismatch app.js:1 lib (Runes packages/lib/node.js, oracle packages/lib/legacy.js) and typescript:false-edge app.js:2 dual
- **ran (line 234b4bce741c):** node --test --test-name-pattern='no tsconfig covers' test/corpus.test.mjs at 0c1d002 (the dynamic import() line added), the oracle as on release/1.1.0 · **saw:** fail 1: checked: typescript 6; 3 disagreements, 0 explained, the third typescript:false-edge app.js:4 dual (Runes packages/dual/esm.mjs, oracle unresolved)
- **ran (line 234b4bce741c):** node --test --test-name-pattern='no tsconfig covers' test/corpus.test.mjs at 0c1d002 with the earlier worker's unfinished oracle (node10 for a path, nodenext for a package, the call form ignored) · **saw:** fail 1: 1 disagreement, typescript:mismatch app.js:4 dual, Runes packages/dual/esm.mjs, oracle packages/dual/cjs.cjs; so the call form decides the case
- **ran (line 234b4bce741c):** node --test --test-name-pattern='no tsconfig covers' test/corpus.test.mjs at 904913f (the fix) · **saw:** tests 1, pass 1, fail 0
- **ran (line 234b4bce741c):** RUNES_CORPUS_DIR=<shared cache> node scripts/corpus.mjs oracles --only react --explained <empty file>, with the release's oracle and then with the fix · **saw:** before: checked typescript 11101, 640 disagreements (94 mismatch, 516 recall-loss, 30 false-edge); after: 554 (0 mismatch, 486 recall-loss, 68 false-edge): 94 mismatches, 39 recall losses and 2 false edges gone, 40 false edges (exports pattern ./src/* imported without an extension) and 9 recall losses (fixtures with their own install) new; the same set, line for line, as the earlier worker's unfinished oracle
- **ran (line 234b4bce741c):** RUNES_CORPUS_DIR=<shared cache> node scripts/corpus.mjs gate --tier all --strict at the fix before koa's explanations were removed, then gate --tier all --only koa,react --strict at 904913f · **saw:** first: every repository ok, 0 added, 0 removed; react 554 disagreements, 554 explained; 2 explanations of koa (the node10 reading) UNUSED, and the 5 skipped Go and .NET oracles this machine lacks; then koa checked typescript 182, 0 disagreements, react 554 explained, corpus gate: passed
- **ran (line 234b4bce741c):** npm run check and npm run coverage at 904913f (release/1.1.0 at e9509e1 merged in) · **saw:** check: tests 2544, pass 2543, fail 0, skipped 1 (the Go oracle test, go is not installed), dist/ is fresh; coverage: all files 99.18 lines, 95.69 branches, 99.20 functions
- **ran (line 234b4bce741c):** node --test --test-name-pattern='no tsconfig covers' test/corpus.test.mjs in an extraction of 0c1d002, then npm run check at 904913f and corpus.mjs gate --tier all --strict over the shared cache · **saw:** at 0c1d002 fail 1 (checked typescript 6; 3 disagreements, 0 explained); at 904913f tests 2544, pass 2543, fail 0; corpus: 33 repositories, every one ok, react typescript 11101 checked, 554 disagreements, 554 explained, koa 182 checked, 0 disagreements; the strict run fails only on the 5 Go and .NET oracles this machine lacks

### Notes

Assumed: the oracle reads a file no tsconfig covers with Bundler, customConditions node and the mode Node gives the file (NodeNext's implied format), overridden by the reference's call form (require to require, import and esm to import), instead of the earlier worker's split of node10 for a path and nodenext for a package: one reading for both kinds of specifier, the conditions exactly types, node, default and import or require, a path probed for its extension and index as Runes probes it, and the call form Runes reads. On react both give the same 554 disagreements; on the fixture only this one agrees with Runes for import() in a CommonJS file.

Assumed: the merge of release/1.1.0 (e9509e1) into the branch conflicted in four shared files and was resolved by union rather than stopped, since each conflict was two additions at one place: the catalogue count 869 + 7 here + 24 there = 900, the Rust rev 18 from the release with the TypeScript rev 5 from 551, the release's two Rust paragraphs in docs/api.md before this branch's TypeScript call-forms paragraph, and both appended sections of corpus/explained.md; the rebuilt dist/ was identical and npm run check passed at the tip. Merge commit 1c9c23e.

Assumed: the oracle still ignores the call form for a file a tsconfig covers (a require() or import() there is checked in the file's own mode); that is outside this issue and reported as found.

