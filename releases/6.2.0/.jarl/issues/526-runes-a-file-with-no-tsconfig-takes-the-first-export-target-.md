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

## Reviews
- **changes** · by rev-526-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1042-uchw
  Important: src/relations/extractors/typescript-resolve.mts:260 - a dynamic import() takes the import condition under every resolution, but TypeScript 6.0.3 resolves it in CommonJS mode (the require condition) where it would transform the call: under Bundler (or any non-Node, non-preserve module) in a file whose format is require (.cts under module esnext, any .ts/.js under module commonjs). Probed with the compiler: a.cts under bundler+esnext and b.ts under bundler+commonjs bind lib/cjs; Runes on c2caa0c binds the esm target, where before the change it bound cjs. The test at test/relations/extractors/typescript-resolve.test.mjs:371 asserts the wrong target, and docs/api.md:86 and the changelog state the rule without this limit. Important: src/relations/extractors/typescript.mts:278 - a type-position import() (typeof import('x'), let v: import('x').T) is marked callForm import, but TypeScript resolves an import type by the file's format: under nodenext a .cts (or a CommonJS .ts) file's typeof import('lib') binds the require target in TypeScript 6.0.3, and Runes now binds the import target (before the change it bound require). No case covers a type-position import. Checked and right: the sixth argument is optional, documented in docs/api.md and the ResolverDeps comment, passed by all three resolver call sites, and reaches Yggdrasil (guardedResolve returns makeResolvePathToFile's function unwrapped) and Grain unchanged; the development-to-default fixture edit is a true update (the old key was entered only by the first-target reading this issue removes, and the test still proves an excluded target is skipped); every one of react's 2060 and koa's 2 changed golden lines has its explanation and each is right; the 94 react mismatches are the oracle's Node10 choice for files no tsconfig covers (scripts/corpus.mjs:581); the versioned types range matched the compiler on 288539 fuzzed ranges; dist rebuilds identical; red before, green after for every new case; corpus gate for koa and react passes.
  outside the issue, filed as 550: Minor: scripts/corpus.mjs:581 resolves a file no tsconfig covers with Node10, which ignores exports, so the TypeScript oracle cannot check the exports reading Runes now applies to such files (react keeps 94 explained mismatches); an oracle that resolves those files as Node16 or Bundler would check it.
  outside the issue, filed as 551: Minor: the resolution-mode import attribute (import type ... with { 'resolution-mode': 'import' }, and the same in an import type node) overrides the mode in TypeScript, and Runes ignores it; it existed before this change.

## Evidence

### Proof

- **ran (line 7cd6f96c72dd):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (before the fix, at the test commit 1a78ad2; after at tip) · **saw:** before: 19 failing, among them the react-server, edge-light, react-native and esm-package cases and the no-tsconfig unit tests; after: all pass
- **ran (line 2cb55f029914):** node scripts/corpus.mjs gate --only react,koa --tier all (cache in a scratch folder), before and after · **saw:** react oracle disagreements 1575 (543 explained) before, 637 (637 explained) after; react.edges 1030 references changed, all explained; 94 remaining are the oracle's node10 limit, explained
- **ran (line 7cd6f96c72dd):** the four no-tsconfig catalogue cases and the resolveTsPath no-tsconfig describe block on 1a78ad2 and c2caa0c; a dist rebuild compared with the committed dist · **saw:** 1a78ad2: react-server, edge-light, react-native and esm-package-import-branch cases fail, 'skips the react-server, edge-light, worker and react-native keys...' fails; c2caa0c: all pass; rebuilt dist identical to the committed one
- **ran (line 2cb55f029914):** node scripts/corpus.mjs gate --only koa,react --tier all on c2caa0c and on release/1.1.0, repositories fetched at their pinned commits into a scratch cache; every changed golden line matched against its explained.md entry · **saw:** c2caa0c: koa 96 edges, 0 added/removed, 2 disagreements 2 explained; react 10026 edges, 0 added/removed, 637 disagreements 637 explained; gate passed. release/1.1.0: react 1575 disagreements, 543 explained (1032 unexplained). Golden: react 1030 removed and 1030 added lines, koa 2 removed, each one-to-one with an explanation (1822 react-server, 184 workerd/deno/worker/edge-light, 44 nested react-server, 10 react-native lines; koa's two are import('koa') whose import target dist/koa.mjs is untracked). The 94 remaining react mismatches are server.node.js against the legacy server.js because scripts/corpus.mjs:581 resolves a file no tsconfig covers with Node10, which ignores exports

### Notes

Assumed: a file no tsconfig covers takes its format as Node does (an extension of .mts/.mjs imports, .cts/.cjs requires, any other TS/JS extension by the nearest package.json type); a tsconfig that sets neither moduleResolution nor a deciding module keeps the first-target reading, which 526 does not name.

Assumed: the existing test 'an excluded exports condition target is skipped' used a 'development' key under no tsconfig, which only the old first-target reading entered; its fixture now names the target under 'default', so it still tests that an excluded target is skipped and the next condition wins.

Line 2 is reachable in part: react's heavy-tier oracle disagreements went from 1575 (543 explained) to 637 (all explained); 938 of the 1032 unexplained ones are gone. The 94 that remain are not of this kind: the oracle resolves a file under no tsconfig with node10, which ignores exports (corpus/explained.md), so for react-dom/server and its siblings it names server.js where the exports entry's node and default keys name server.node.js, which Runes now binds. I explained them as limits of the oracle and did not change the oracle. react.edges changed by 1030 references (1030 added, 1030 removed), each explained in corpus/explained.md; koa.edges lost 2 (a dynamic import of koa reads the import condition, whose target is untracked build output).

