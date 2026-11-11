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
- TS/JS: an import in a file no tsconfig covers binds the target that Node and TypeScript choose from a package's `exports` (`import` or `require` by the file's format, `types`, `node`, `default`), so a `react-server`, `workerd`, `edge-light` or `react-native` build is no longer taken for `default`; a `require('x')` call and `import x = require('x')` read the `require` condition and a dynamic `import('x')` the `import` condition; a `types@<range>` key is entered when TypeScript 6.0.3 satisfies its range and passed over when it does not. A consumer's graph can bind these imports to another file of the same package, and an `import('x')` of a package whose `import` target is untracked build output binds nothing.

## Evidence

### Proof

- **ran (line 805af806773e):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs (red at 1a78ad2, green at tip) · **saw:** before: the call-form unit tests and cases node16-dynamic-import-in-cjs-file and node16-require-call-in-esm-package fail; after: pass
- **ran (line 7435c3484025):** node --test test/relations/extractors/typescript-resolve.test.mjs test/relations/extractors/typescript-version-range.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs (red at 1a78ad2, green at tip) · **saw:** before: versioned-key unit tests and cases versioned-types-key-in-range and out-of-range fail; after: pass, and the range reading agrees with the compiler's VersionRange on 342 ranges

### Notes

Assumed: the TypeScript version a types@<range> key is tested against is 6.0.3, the family's pin that the catalogue cites; Runes does not run the compiler. The range is read as the compiler reads it (ported, and checked against its VersionRange in a test), so a range the compiler fails to parse is skipped.

Assumed: carrying the call form needed the extractor to mark require(), import x = require() and import() (TargetHint callForm, extractor rev 4) and the resolver chain to pass it, which touches types, typescript, resolver and resolve-path beside the issue's Files; I judged it part of line 1, which cannot be met without it. docs/api.md describes the field and the sixth argument of resolvePathToFile. Issues 491 and 526 share one function and one set of commits.

