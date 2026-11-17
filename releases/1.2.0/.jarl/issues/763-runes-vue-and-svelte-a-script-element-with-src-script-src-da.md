# 763 · Runes, Vue and Svelte: a script element with src (<script src="../data/d.ts"></script>) emits no use

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-hcfu
**Tags:** api, runes, svelte, typescript, vue
**Files:** Runes/src/relations/extractors/typescript.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-sfc-script-src
**Where:** Runes/src/relations/extractors/typescript.mts:498
**Branch:** jarl/762-sfc-and-ts-calls
**Worker:** w-762-haiku
**Model:** claude-haiku-5-5@max
**Since:** 2026-11-17 11:47

## What
Claim: At v1.1.0 sfcScriptView keeps only the bytes between the tags of a script element; a script with an empty body and a src attribute gives no use, and the attribute is never read.

repros.sh vue_script: src/ui/s.vue holding <script src="../data/d.ts"></script> printed no use for the file

Moved from issue 763 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A component that takes its code from a file through src has no edge to it, so a consumer cannot see the dependency. A new family tool that uses the readers as they are found it.

## Acceptance
[test] A Vue and a Svelte component with <script src="../data/d.ts"></script> give a use of that file at the line of the element, red at v1.1.0 (no use) and green after; or docs/api.md lists it as unread and a test pins the empty answer; every existing answer and edge stays as it is · by: npm run check

## Changelog


- A Vue or Svelte component whose script is a relative file, `<script src="../data/d.ts"></script>` (a `src` that starts with `./` or `../` and holds no quote or backslash), now gives a use of that file at the line of the element, so the component depends on it. Any other `src`, such as a URL or a path that starts with `/` or `//`, gives no use. This can show new findings: a consumer's graph that forbids or lacks that dependency now reports the component. A tag that runs over lines, with no room for the import on its first line, still gives no use.

## Reviews
- **changes** · by rev-762-opus (fresh) · 2026-11-17 · model claude-opus-5-5@high · batch 20261117T1242-phww
  Important (756): the corpus gate is red at the tip. corpus.mjs verify gives jest +73 and next-intl +20 unexplained (both routine tier, so CI's corpus job fails) and react +131 (heavy tier); only skywalking-booster-ui and vitepress were updated. Every added edge sits on a vi.mock or jest.mock line and reads the mock as the issue intends, so the fix is the goldens and corpus/explained.md for jest, next-intl and react, not code. With the v1.1.0 extractor the same verify gives jest and next-intl ok. Minor (762): yes, a regression against v1.1.0, which skipped nothing: a <!-- outside a comment (an attribute value, the raw text of <style> or <textarea>, a Svelte {@html '<!--'}) that a later --> closes, including i-->0 inside the script, hides every script between them, and the component has no view where v1.1.0 read ./a at line 2. It needs a stray <!-- with a --> after the script, and nothing in the corpus has one (256 Vue views identical to v1.1.0, same length and lines). docs/api.md does not name this limit; name it, or skip <!-- inside a tag's quoted attribute values. Minor (762): the changelog says the change only removes uses, but <!-- <script> --> before a real script gave v1.1.0 no use and now gives the real script's, so it can add uses. Minor (762): the test for a commented script beside a real one is Vue only; the same Svelte case passes on the tip. Minor (763): the src value goes into the view unescaped and unfiltered. A protocol-relative //host/a.js is not dropped as https: is, and a root-absolute /js/a.js in <svelte:head> becomes an unfollowed use although it is a browser URL. A src of .\x.js reads as '.' and resolves to the directory's index file, and a double quote inside a single-quoted src injects a second import. All are invented inputs, none is in the corpus. Read and re-run on a scratch clone of a8266bf: red before with the v1.1.0 typescript.mts (fail 7, each failure the issue's own), green after (220 of 220), npm run check green (2762, 2759 pass, 3 skipped, dist fresh). Commits: one per issue plus two corpus commits, dist with src, rev 6 to 9, catalogue 992 to 993 in all three places, no agent trailer. Kept: a <!-- inside a script body or a template string is text, every line and column of the view, every existing Vue answer in the corpus. Merge note: the branch carries release/1.2.0 at 20aceea, the release is at fb89628 (999 cases), so the catalogue count (1000 after the merge) and the extractor-rev test will conflict.
  outside the issue, filed as 10: TypeScript and JavaScript: the companion forms of a test mock give no use: jest.requireActual('x'), jest.requireMock('x'), vi.importActual('x'), jest.doMock('x'), vi.doMock('x'), jest.unmock('x') and a chained jest.mock('a').mock('b') (its second path), although requireActual and importActual load the real module; seen in the corpus at next-intl createNavigation.test.tsx:22 (vi.importActual('use-intl')) and jest-resolve resolve.test.ts:22 (the chained form)
- **approve** · by rev-762-opus (fresh) · 2026-11-17 · model claude-opus-5-5@high · batch 20261117T1328-qpah
  Minor (756): six of the eight react recall-loss explanations in corpus/explained.md say the fixture's package.json declares react 0.14, but the react-15, react-16 and react-17 fixtures declare 15, 16 and 17.0.0-rc.3. Minor (763): a relative src inside <svelte:head> is read from the component's directory, while the browser resolves it from the page's URL. It is rare, and the docs and changelog describe the reading as it is. Read and re-run on a scratch clone of ffa04f7: the tests and npm run check are green (224 of 224; 2784, 2781 pass, 3 skipped, dist fresh); the 763 relative-src test is red at a8266bf; the mock and src tests are red at v1.1.0. The routine corpus gate passes over 25 repositories (the go and csharp oracles were skipped, no toolchain), and react, typeorm and shaka-player verify ok. All 421 new golden edges (airflow 197, jest 73, next-intl 20, react 131) sit on vi.mock or jest.mock calls, the 36 oracle disagreements are explained, and nothing was removed. A src of //host, /js, https:, a quote or a backslash gives no use; ./ and ../ give one at the element's line, with the view's lines kept. The merge of release/1.2.0 at 65848ce carries catalogue 1002.

## Evidence

### Proof

- **ran (line 83acff0e947e):** npm run build && node --test test/relations/extractors/typescript.test.mjs · **saw:** tests 44, pass 42, fail 2: the two tests that expect a use of the src file at its element's line failed; the tests that pin the bodied, tall and no-file cases passed before the change
- **ran (line 83acff0e947e):** npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs · **saw:** tests 214, pass 214, fail 0
- **ran (line 83acff0e947e):** npm run check · **saw:** tests 2762, pass 2759, fail 0, skipped 3 (the Go oracle without go, and the two Rust build tests without a toolchain); dist/ is fresh. npm run coverage: lines 99.21, branches 95.88, functions 99.03, thresholds 98, 92 and 97
- **ran (line 83acff0e947e):** scratch clone of a8266bf with src/relations/extractors/typescript.mts from 1f3476b (v1.1.0): npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs · **saw:** fail 7; the 763 failures: 'gives a use of the file a src names at the line of its script element, in Vue and Svelte' and 'reads a src in each quoting'; the bodied, tall and no-file test passed, as it pins the empty answer
- **ran (line 83acff0e947e):** scratch clone of a8266bf: npm run build && npm run grammars && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs; then npm run check · **saw:** tests 220, pass 220, fail 0; npm run check: tests 2762, pass 2759, fail 0, skipped 3, dist/ is fresh
- **ran (line 83acff0e947e):** scratch clone of a8266bf: invented src elements through sfcScriptView, uses() and the catalogue runner · **saw:** view length and lines kept; whitespace-only body read as none; src //host/a.js and /js/a.js (svelte:head) give absent unfollowed uses; src .\\x.js reads as '.' and resolves to the directory's index.js; a double quote inside a single-quoted src injects a second import
- **ran (line 83acff0e947e):** npm run build && node --test test/relations/extractors/typescript.test.mjs · **saw:** tests 50, pass 49, fail 1: the test that reads a src only as a relative path failed on a protocol-relative src, before the change
- **ran (line 83acff0e947e):** npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs test/relations/catalogue.test.mjs · **saw:** tests 224, pass 224, fail 0
- **ran (line 83acff0e947e):** npm run check · **saw:** tests 2784, pass 2781, fail 0, skipped 3 (the Go oracle without go, and the two Rust build tests without a toolchain); dist/ is fresh. npm run coverage: lines 99.23, branches 95.87, functions 99.10, thresholds 98, 92 and 97
- **ran (line 83acff0e947e):** scratch clone of ffa04f7: npm run build && npm run grammars && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs; then npm run check · **saw:** tests 224, pass 224, fail 0; npm run check: tests 2784, pass 2781, fail 0, skipped 3, dist/ is fresh
- **ran (line 83acff0e947e):** scratch clone of ffa04f7 with typescript.mts from a8266bf: npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs; then invented src elements · **saw:** fail 3, the relative-src test among them; at the tip //host, /js, https:, a quote and a backslash give no use, ./a.ts and ../data/d.ts give one at the element's line, view length and lines kept
- **ran (line 83acff0e947e):** scratch clone of 7823e7e: npm run build && npm run grammars && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs; then npm run check; then corpus.mjs gate --tier routine and gate --tier all --only react · **saw:** tests 226, pass 226, fail 0; npm run check: tests 2786, pass 2783, fail 0, skipped 3, dist/ is fresh; corpus gate passed over 25 routine repositories (go and csharp oracles skipped, no toolchain) and react

### Notes

Assumed: a body that is only whitespace counts as no body, since a browser loads the file of a src element and ignores its body; a tag that runs over lines with no room for the import on its first line gives no use, so the lines of the component do not move.

Corpus: no edge of skywalking-booster-ui or vitepress moved for this issue.

Corpus at ffa04f7: unchanged; the routine tier and the heavy-tier verify pass with nothing added or removed.

