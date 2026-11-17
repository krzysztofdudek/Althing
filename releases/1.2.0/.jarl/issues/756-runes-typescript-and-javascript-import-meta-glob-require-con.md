# 756 · Runes, TypeScript and JavaScript: import.meta.glob, require.context and vi.mock emit no use

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-eiig
**Tags:** api, glob, javascript, runes, typescript
**Files:** Runes/src/relations/extractors/typescript.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-glob-context-mock
**Where:** Runes/src/relations/extractors/typescript.mts:334
**Branch:** jarl/762-sfc-and-ts-calls
**Worker:** w-762-haiku
**Model:** claude-haiku-5-5@max
**Since:** 2026-11-17 11:47

## What
Claim: At v1.1.0 the TypeScript extractor emits import, export from, require, dynamic import, import x = require, new URL with import.meta.url and import types. A call of import.meta.glob (Vite), require.context (webpack) or vi.mock (Vitest) with a string path is none of them and gives no use. No document of Runes lists them as unread.

repros.sh glob_forms: a file holding import.meta.glob("../data/*.ts"), require.context("../data", false, /\.ts$/) and vi.mock("../data/d") printed no use at all

Moved from issue 756 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A file that reaches the repository only through import.meta.glob, require.context or vi.mock has no edge and no count, so a consumer cannot tell it from a file that reaches nothing. A new family tool that uses the readers as they are found it.

## Acceptance
[test] In TypeScript and JavaScript, vi.mock and jest.mock with a literal path give a use of the file they name, as import() does, in a unit test and a catalogue case, red at v1.1.0 (no use) and green after; import.meta.glob and require.context are listed in docs/api.md as unread and a test pins the empty answer (ruling runes-1-2-0-plan, D3) · by: npm run check

## Changelog
- `vi.mock('…')` and `jest.mock('…')` with a string-literal path now give a use of the file the path names, as a dynamic `import('…')` does, so a test that replaces a module depends on that module. This can show new findings: a graph that forbids a test's dependency on the module it mocks now reports that test. The `import.meta.glob(…)` and `require.context(…)` forms still give no use.

## Evidence

### Proof

- **ran (line 12a90290073a):** npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs · **saw:** tests 202, pass 198, fail 4: the vi.mock and jest.mock unit test, the flipped TypeScript catalogue case, the new JavaScript catalogue case and the extractor rev expectation failed; the import.meta.glob and require.context test passed before the change
- **ran (line 12a90290073a):** npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs · **saw:** tests 220, pass 220, fail 0; the catalogue holds 993 cases and every case runs once
- **ran (line 12a90290073a):** npm run check · **saw:** tests 2762, pass 2759, fail 0, skipped 3 (the Go oracle without go, and the two Rust build tests without a toolchain); dist/ is fresh. npm run coverage: lines 99.21, branches 95.88, functions 99.03, thresholds 98, 92 and 97

### Notes

Assumed: a mock call reads the import condition, as the dynamic import() of the same path does, whatever the module format of the test file; a template literal with no substitution counts as a string literal, as import() reads it.

Corpus, after the last change: skywalking-booster-ui went from 1226 to 1268 edges (42 added, every one a vi.mock call of a literal path) and vitepress from 553 to 554 (one added, vi.mock of the package's own name, which the golden already reads for langs.test.ts). No edge was removed. The entries are in corpus/explained.md, and the goldens were regenerated in the commit after this one.

