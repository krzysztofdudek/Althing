# 526 · Runes: a file with no tsconfig takes the first export target that exists, whatever its condition (react: 1115 oracle mismatches)

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0445-cbnz
**Tags:** 1.1.1, runes, typescript
**Files:** Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** Runes
**After:** 482
**Found by:** w-runes-477-opus
**Where:** The 477 worker's heavy-tier read (2026-11-03): react at its pinned commit, react resolving to react.react-server.js, react-dom/server to server.edge.js, use-sync-external-store/shim to index.native.js
**Branch:** jarl/526-ts-conditions
**Worker:** w-526-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:16

## What
482 selects export conditions by the importing file's module settings, and keeps the old reading where no tsconfig decides. In react most files have no tsconfig, so the first target that exists on disk wins, which is often a react-server, edge or native build no resolver would pick by default.

## Why
1115 edges in one widely used repository point at files the real tools do not read.

## Acceptance
- A file no tsconfig covers resolves exports with the default conditions Node and TypeScript use (import or require by format, then types, node, default), with cases for react-server, edge and native targets, red before and green after
- react's heavy-tier oracle mismatches of this kind are gone, and its golden changes only by lines this explains

## Changelog
- TS/JS: an import in a file no tsconfig covers binds the target that Node and TypeScript choose from a package's `exports` (`import` or `require` by the file's format, `types`, `node`, `default`), so a `react-server`, `workerd`, `edge-light` or `react-native` build is no longer taken for `default`; a `require('x')` call and `import x = require('x')` read the `require` condition and a dynamic `import('x')` the `import` condition; a `types@<range>` key is entered when TypeScript 6.0.3 satisfies its range and passed over when it does not. A consumer's graph can bind these imports to another file of the same package, and an `import('x')` of a package whose `import` target is untracked build output binds nothing.

## Evidence

### Proof

- **ran (line 7cd6f96c72dd):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (before the fix, at the test commit 1a78ad2; after at tip) · **saw:** before: 19 failing, among them the react-server, edge-light, react-native and esm-package cases and the no-tsconfig unit tests; after: all pass
- **ran (line 2cb55f029914):** node scripts/corpus.mjs gate --only react,koa --tier all (cache in a scratch folder), before and after · **saw:** react oracle disagreements 1575 (543 explained) before, 637 (637 explained) after; react.edges 1030 references changed, all explained; 94 remaining are the oracle's node10 limit, explained

### Notes

Assumed: a file no tsconfig covers takes its format as Node does (an extension of .mts/.mjs imports, .cts/.cjs requires, any other TS/JS extension by the nearest package.json type); a tsconfig that sets neither moduleResolution nor a deciding module keeps the first-target reading, which 526 does not name.

Assumed: the existing test 'an excluded exports condition target is skipped' used a 'development' key under no tsconfig, which only the old first-target reading entered; its fixture now names the target under 'default', so it still tests that an excluded target is skipped and the next condition wins.

Line 2 is reachable in part: react's heavy-tier oracle disagreements went from 1575 (543 explained) to 637 (all explained); 938 of the 1032 unexplained ones are gone. The 94 that remain are not of this kind: the oracle resolves a file under no tsconfig with node10, which ignores exports (corpus/explained.md), so for react-dom/server and its siblings it names server.js where the exports entry's node and default keys name server.node.js, which Runes now binds. I explained them as limits of the oracle and did not change the oracle. react.edges changed by 1030 references (1030 added, 1030 removed), each explained in corpus/explained.md; koa.edges lost 2 (a dynamic import of koa reads the import condition, whose target is untracked build output).

