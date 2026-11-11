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

## Evidence

### Proof

- **ran (line 234b4bce741c):** node --test --test-name-pattern='no tsconfig covers' test/corpus.test.mjs at 95f867a, the oracle as on release/1.1.0 (before the fix) · **saw:** fail 1: FAIL conditions, checked: typescript 5; 2 disagreements, 0 explained: typescript:mismatch app.js:1 lib (Runes packages/lib/node.js, oracle packages/lib/legacy.js) and typescript:false-edge app.js:2 dual
- **ran (line 234b4bce741c):** node --test --test-name-pattern='no tsconfig covers' test/corpus.test.mjs at 0c1d002 (the dynamic import() line added), the oracle as on release/1.1.0 · **saw:** fail 1: checked: typescript 6; 3 disagreements, 0 explained, the third typescript:false-edge app.js:4 dual (Runes packages/dual/esm.mjs, oracle unresolved)
- **ran (line 234b4bce741c):** node --test --test-name-pattern='no tsconfig covers' test/corpus.test.mjs at 0c1d002 with the earlier worker's unfinished oracle (node10 for a path, nodenext for a package, the call form ignored) · **saw:** fail 1: 1 disagreement, typescript:mismatch app.js:4 dual, Runes packages/dual/esm.mjs, oracle packages/dual/cjs.cjs; so the call form decides the case
- **ran (line 234b4bce741c):** node --test --test-name-pattern='no tsconfig covers' test/corpus.test.mjs at 904913f (the fix) · **saw:** tests 1, pass 1, fail 0
- **ran (line 234b4bce741c):** RUNES_CORPUS_DIR=<shared cache> node scripts/corpus.mjs oracles --only react --explained <empty file>, with the release's oracle and then with the fix · **saw:** before: checked typescript 11101, 640 disagreements (94 mismatch, 516 recall-loss, 30 false-edge); after: 554 (0 mismatch, 486 recall-loss, 68 false-edge): 94 mismatches, 39 recall losses and 2 false edges gone, 40 false edges (exports pattern ./src/* imported without an extension) and 9 recall losses (fixtures with their own install) new; the same set, line for line, as the earlier worker's unfinished oracle
- **ran (line 234b4bce741c):** RUNES_CORPUS_DIR=<shared cache> node scripts/corpus.mjs gate --tier all --strict at the fix before koa's explanations were removed, then gate --tier all --only koa,react --strict at 904913f · **saw:** first: every repository ok, 0 added, 0 removed; react 554 disagreements, 554 explained; 2 explanations of koa (the node10 reading) UNUSED, and the 5 skipped Go and .NET oracles this machine lacks; then koa checked typescript 182, 0 disagreements, react 554 explained, corpus gate: passed
- **ran (line 234b4bce741c):** npm run check and npm run coverage at 904913f (release/1.1.0 at e9509e1 merged in) · **saw:** check: tests 2544, pass 2543, fail 0, skipped 1 (the Go oracle test, go is not installed), dist/ is fresh; coverage: all files 99.18 lines, 95.69 branches, 99.20 functions

### Notes

Assumed: the oracle reads a file no tsconfig covers with Bundler, customConditions node and the mode Node gives the file (NodeNext's implied format), overridden by the reference's call form (require to require, import and esm to import), instead of the earlier worker's split of node10 for a path and nodenext for a package: one reading for both kinds of specifier, the conditions exactly types, node, default and import or require, a path probed for its extension and index as Runes probes it, and the call form Runes reads. On react both give the same 554 disagreements; on the fixture only this one agrees with Runes for import() in a CommonJS file.

Assumed: the merge of release/1.1.0 (e9509e1) into the branch conflicted in four shared files and was resolved by union rather than stopped, since each conflict was two additions at one place: the catalogue count 869 + 7 here + 24 there = 900, the Rust rev 18 from the release with the TypeScript rev 5 from 551, the release's two Rust paragraphs in docs/api.md before this branch's TypeScript call-forms paragraph, and both appended sections of corpus/explained.md; the rebuilt dist/ was identical and npm run check passed at the tip. Merge commit 1c9c23e.

Assumed: the oracle still ignores the call form for a file a tsconfig covers (a require() or import() there is checked in the file's own mode); that is outside this issue and reported as found.

