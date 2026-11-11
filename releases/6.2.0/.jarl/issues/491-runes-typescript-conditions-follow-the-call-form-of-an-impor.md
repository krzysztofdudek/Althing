# 491 · Runes: TypeScript conditions follow the call form of an import (require() or import()) and skip a types@<range> key whose range TypeScript's version fails

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0434-ndds
**Tags:** 1.1.1, runes, typescript
**Files:** Runes/src/relations/extractors/typescript-resolve.mts
**Repo:** Runes
**After:** 482
**Found by:** rev-runes-482-opus
**Where:** Review of 482 (2026-11-03): the extractor already knows the call form (isRequire in typescript.mts); an ESM-only workspace package imported with import() from a Node16 CommonJS file has no edge
**Branch:** jarl/526-ts-conditions
**Worker:** w-526-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:16

## What
482 picks export conditions by the importing file's format, not by the call: a require() in an ES module and an import() in a CommonJS file take the file's conditions. A types@<range> key stops the lookup, where TypeScript skips a range its version fails and goes on to types.

## Why
A lost edge to an ESM-only package from a dynamic import, and a lost types target.

## Acceptance
- require() and import() calls select require and import conditions by their own form, with a case each, red before and green after
- A types@<range> key whose range the TypeScript version fails is skipped, with a case

## Changelog
- TS/JS: an import in a file no tsconfig covers binds the target that Node and TypeScript choose from a package's `exports` (`import` or `require` by the file's format, `types`, `node`, `default`), so a `react-server`, `workerd`, `edge-light` or `react-native` build is no longer taken for `default`; a `require('x')` call and `import x = require('x')` read the `require` condition, and a dynamic `import('x')` the `import` condition except where the compiler emits it as a `require` (outside the Node module settings and `preserve`, in a file emitted as CommonJS, such as a `.cts` file or any file under `module` commonjs), where it reads `require`; an import type (`typeof import('x')`, `import('x').T`) reads the condition of its file's format; a `types@<range>` key is entered when TypeScript 6.0.3 satisfies its range and passed over when it does not. A consumer's graph can bind these imports to another file of the same package, and an `import('x')` of a package whose `import` target is untracked build output binds nothing.

## Reviews
- **changes** · by rev-526-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1042-uchw
  Important: src/relations/extractors/typescript-resolve.mts:260 - a dynamic import() takes the import condition under every resolution, but TypeScript 6.0.3 resolves it in CommonJS mode (the require condition) where it would transform the call: under Bundler (or any non-Node, non-preserve module) in a file whose format is require (.cts under module esnext, any .ts/.js under module commonjs). Probed with the compiler: a.cts under bundler+esnext and b.ts under bundler+commonjs bind lib/cjs; Runes on c2caa0c binds the esm target, where before the change it bound cjs. The test at test/relations/extractors/typescript-resolve.test.mjs:371 asserts the wrong target, and docs/api.md:86 and the changelog state the rule without this limit. Important: src/relations/extractors/typescript.mts:278 - a type-position import() (typeof import('x'), let v: import('x').T) is marked callForm import, but TypeScript resolves an import type by the file's format: under nodenext a .cts (or a CommonJS .ts) file's typeof import('lib') binds the require target in TypeScript 6.0.3, and Runes now binds the import target (before the change it bound require). No case covers a type-position import. Checked and right: the sixth argument is optional, documented in docs/api.md and the ResolverDeps comment, passed by all three resolver call sites, and reaches Yggdrasil (guardedResolve returns makeResolvePathToFile's function unwrapped) and Grain unchanged; the development-to-default fixture edit is a true update (the old key was entered only by the first-target reading this issue removes, and the test still proves an excluded target is skipped); every one of react's 2060 and koa's 2 changed golden lines has its explanation and each is right; the 94 react mismatches are the oracle's Node10 choice for files no tsconfig covers (scripts/corpus.mjs:581); the versioned types range matched the compiler on 288539 fuzzed ranges; dist rebuilds identical; red before, green after for every new case; corpus gate for koa and react passes.
  outside the issue, filed as 550: Minor: scripts/corpus.mjs:581 resolves a file no tsconfig covers with Node10, which ignores exports, so the TypeScript oracle cannot check the exports reading Runes now applies to such files (react keeps 94 explained mismatches); an oracle that resolves those files as Node16 or Bundler would check it.
  outside the issue, filed as 551: Minor: the resolution-mode import attribute (import type ... with { 'resolution-mode': 'import' }, and the same in an import type node) overrides the mode in TypeScript, and Runes ignores it; it existed before this change.

## Evidence

### Proof

- **ran (line 805af806773e):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs (red at 1a78ad2, green at tip) · **saw:** before: the call-form unit tests and cases node16-dynamic-import-in-cjs-file and node16-require-call-in-esm-package fail; after: pass
- **ran (line 7435c3484025):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-version-range.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs (red at 1a78ad2, green at tip) · **saw:** before: versioned-key unit tests and cases versioned-types-key-in-range and out-of-range fail; after: pass, and the range reading agrees with the compiler's VersionRange on 342 ranges
- **ran (line 805af806773e):** git archive 1a78ad2 and c2caa0c into a scratch folder; npm ci; npm run build; npm run grammars; node --test --test-concurrency=6 test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/typescript.test.mjs test/relations/catalogue.test.mjs on 1a78ad2; the full suite on c2caa0c; a probe of TypeScript 6.0.3 getModeForUsageLocation and getResolvedModuleFromModuleSpecifier on import() and typeof import() under bundler+esnext, bundler+commonjs, nodenext and preserve · **saw:** 1a78ad2: 19 fail, among them both call-form cases (node16 dynamic import in a cjs file, node16 require call in an esm package) and 'under Bundler the call form decides as well'; c2caa0c: 2130 pass, 0 fail. But TypeScript 6.0.3 gives import() in a .cts file under bundler+esnext, and in a .ts file under bundler+commonjs, CommonJS mode and the require target, where Runes now binds the import target (the test at typescript-resolve.test.mjs:371 asserts the import target); and typeof import('x') in a CommonJS file under nodenext reads the file's mode (require), where the extractor marks it callForm import and Runes binds the import target
- **ran (line 7435c3484025):** node --test test/relations/extractors/typescript-version-range.test.mjs (in the full suite on c2caa0c), and a seeded fuzz of 300000 random ranges from 39 tokens comparing typeScriptSatisfies with ts.VersionRange.tryParse(...).test(new ts.Version('6.0.3')) · **saw:** 1a78ad2: 'enters a key the version satisfies' and 'skips a key the version fails, or whose range does not parse' fail; c2caa0c: pass; fuzz: 288539 ranges checked, 11461 the compiler throws on, 0 disagreements

### Notes

Assumed: the TypeScript version a types@<range> key is tested against is 6.0.3, the family's pin that the catalogue cites; Runes does not run the compiler. The range is read as the compiler reads it (ported, and checked against its VersionRange in a test), so a range the compiler fails to parse is skipped.

Assumed: carrying the call form needed the extractor to mark require(), import x = require() and import() (TargetHint callForm, extractor rev 4) and the resolver chain to pass it, which touches types, typescript, resolver and resolve-path beside the issue's Files; I judged it part of line 1, which cannot be met without it. docs/api.md describes the field and the sixth argument of resolvePathToFile. Issues 491 and 526 share one function and one set of commits.

