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

## Reviews
- **changes** · by rev-762-opus (fresh) · 2026-11-17 · model claude-opus-5-5@high · batch 20261117T1242-phww
  Important (756): the corpus gate is red at the tip. corpus.mjs verify gives jest +73 and next-intl +20 unexplained (both routine tier, so CI's corpus job fails) and react +131 (heavy tier); only skywalking-booster-ui and vitepress were updated. Every added edge sits on a vi.mock or jest.mock line and reads the mock as the issue intends, so the fix is the goldens and corpus/explained.md for jest, next-intl and react, not code. With the v1.1.0 extractor the same verify gives jest and next-intl ok. Minor (762): yes, a regression against v1.1.0, which skipped nothing: a <!-- outside a comment (an attribute value, the raw text of <style> or <textarea>, a Svelte {@html '<!--'}) that a later --> closes, including i-->0 inside the script, hides every script between them, and the component has no view where v1.1.0 read ./a at line 2. It needs a stray <!-- with a --> after the script, and nothing in the corpus has one (256 Vue views identical to v1.1.0, same length and lines). docs/api.md does not name this limit; name it, or skip <!-- inside a tag's quoted attribute values. Minor (762): the changelog says the change only removes uses, but <!-- <script> --> before a real script gave v1.1.0 no use and now gives the real script's, so it can add uses. Minor (762): the test for a commented script beside a real one is Vue only; the same Svelte case passes on the tip. Minor (763): the src value goes into the view unescaped and unfiltered. A protocol-relative //host/a.js is not dropped as https: is, and a root-absolute /js/a.js in <svelte:head> becomes an unfollowed use although it is a browser URL. A src of .\x.js reads as '.' and resolves to the directory's index file, and a double quote inside a single-quoted src injects a second import. All are invented inputs, none is in the corpus. Read and re-run on a scratch clone of a8266bf: red before with the v1.1.0 typescript.mts (fail 7, each failure the issue's own), green after (220 of 220), npm run check green (2762, 2759 pass, 3 skipped, dist fresh). Commits: one per issue plus two corpus commits, dist with src, rev 6 to 9, catalogue 992 to 993 in all three places, no agent trailer. Kept: a <!-- inside a script body or a template string is text, every line and column of the view, every existing Vue answer in the corpus. Merge note: the branch carries release/1.2.0 at 20aceea, the release is at fb89628 (999 cases), so the catalogue count (1000 after the merge) and the extractor-rev test will conflict.
  outside the issue, filed as 10: TypeScript and JavaScript: the companion forms of a test mock give no use: jest.requireActual('x'), jest.requireMock('x'), vi.importActual('x'), jest.doMock('x'), vi.doMock('x'), jest.unmock('x') and a chained jest.mock('a').mock('b') (its second path), although requireActual and importActual load the real module; seen in the corpus at next-intl createNavigation.test.tsx:22 (vi.importActual('use-intl')) and jest-resolve resolve.test.ts:22 (the chained form)

## Evidence

### Proof

- **ran (line 12a90290073a):** npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs · **saw:** tests 202, pass 198, fail 4: the vi.mock and jest.mock unit test, the flipped TypeScript catalogue case, the new JavaScript catalogue case and the extractor rev expectation failed; the import.meta.glob and require.context test passed before the change
- **ran (line 12a90290073a):** npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs · **saw:** tests 220, pass 220, fail 0; the catalogue holds 993 cases and every case runs once
- **ran (line 12a90290073a):** npm run check · **saw:** tests 2762, pass 2759, fail 0, skipped 3 (the Go oracle without go, and the two Rust build tests without a toolchain); dist/ is fresh. npm run coverage: lines 99.21, branches 95.88, functions 99.03, thresholds 98, 92 and 97
- **ran (line 12a90290073a):** scratch clone of a8266bf with src/relations/extractors/typescript.mts from 1f3476b (v1.1.0): npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs · **saw:** tests 220, pass 213, fail 7; the 756 failures: the vi.mock and jest.mock unit test, typescript-vi-and-jest-mock-literal-edge, javascript-jest-mock-literal-edge (with their two MATRIX suites) and the extractor rev; the import.meta.glob and require.context test passed, as it pins the empty answer
- **ran (line 12a90290073a):** scratch clone of a8266bf: npm run build && npm run grammars && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs · **saw:** tests 220, pass 220, fail 0; the catalogue holds 993 cases
- **ran (line 12a90290073a):** scratch clone of a8266bf: npm run check · **saw:** tests 2762, pass 2759, fail 0, skipped 3; dist/ is fresh
- **ran (line 12a90290073a):** scratch clone of a8266bf: RUNES_CORPUS_DIR=<shared corpus> node scripts/corpus.mjs verify --tier all --only skywalking-booster-ui,vitepress,jest,next-intl,react,typeorm,shaka-player,ky,zod,commander.js,koa,express · **saw:** FAIL next-intl (20 added, unexplained), FAIL jest (73 added), FAIL react, heavy tier (131 added); every added edge sits on a vi.mock or jest.mock call; skywalking-booster-ui, vitepress and the other eight ok. The same verify with the v1.1.0 extractor built gave jest and next-intl ok

### Notes

Assumed: a mock call reads the import condition, as the dynamic import() of the same path does, whatever the module format of the test file; a template literal with no substitution counts as a string literal, as import() reads it.

Corpus, after the last change: skywalking-booster-ui went from 1226 to 1268 edges (42 added, every one a vi.mock call of a literal path) and vitepress from 553 to 554 (one added, vi.mock of the package's own name, which the golden already reads for langs.test.ts). No edge was removed. The entries are in corpus/explained.md, and the goldens were regenerated in the commit after this one.

