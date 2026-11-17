# 762 · Runes, Vue and Svelte: a script block inside an HTML comment is read as code, so a commented-out import counts as a use

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-zyax
**Tags:** api, runes, svelte, typescript, vue
**Files:** Runes/src/relations/extractors/typescript.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-sfc-commented-script
**Where:** Runes/src/relations/extractors/typescript.mts:474, Runes/src/relations/extractors/typescript.mts:488
**Branch:** jarl/762-sfc-and-ts-calls
**Worker:** w-762-haiku
**Model:** claude-haiku-5-5@max
**Since:** 2026-11-17 11:47

## What
Claim: At v1.1.0 sfcScriptView finds script blocks with the regular expression SCRIPT_BLOCK over the raw text, which has no notion of an HTML comment. A component whose only script is inside <!-- ... --> has its imports read.

repros.sh vue_script: src/ui/v.vue holding <template><b/></template> and <!-- <script>import { d } from "../data/d"</script> --> printed src/ui/v.vue:2 ../data/d resolved to src/data/d.ts, as the real script block of ok.vue did

Moved from issue 762 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A commented-out import in a component counts as a use, so a consumer reports a forbidden use that the code does not make. A new family tool that uses the readers as they are found it.

## Acceptance
[test] A Vue and a Svelte component whose only script block is inside an HTML comment give no use, one with a commented-out block beside a real one gives only the real block's uses on their own lines, red at v1.1.0 and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- A Vue or Svelte component whose script sits inside an HTML comment, `<!-- <script>…</script> -->`, no longer gives that script's imports as uses, and a script beside such a comment gives only its own uses. The change only removes uses, so it shows no new findings; a relation declared only for a commented-out import has no code behind it after the upgrade.

## Evidence

### Proof

- **ran (line 0e5389594aae):** npm run build && node --test test/relations/extractors/typescript.test.mjs · **saw:** tests 41, pass 39, fail 2: the two new tests that assert a script inside an HTML comment gives no view failed; the test that pins the html-string answer passed before the change
- **ran (line 0e5389594aae):** npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs · **saw:** tests 211, pass 211, fail 0
- **ran (line 0e5389594aae):** npm run build && node --test test/relations/extractors/typescript.test.mjs · **saw:** tests 46, pass 45, fail 1: the test that reads a <!-- with no --> after it as text failed, since a <!-- inside an attribute value gave the component no view
- **ran (line 0e5389594aae):** npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/catalogue.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs · **saw:** tests 220, pass 220, fail 0
- **ran (line 0e5389594aae):** npm run check · **saw:** tests 2762, pass 2759, fail 0, skipped 3 (the Go oracle without go, and the two Rust build tests without a toolchain); dist/ is fresh. npm run coverage: lines 99.21, branches 95.88, functions 99.03, thresholds 98, 92 and 97

### Notes

Assumed: an HTML comment ends at the first '-->' after its opening '<!--', and '<!-->' ends it at once, as HTML reads it; a comment that never ends hides the rest of the component.

Assumed (supersedes the earlier note on comments): a <!-- with no --> after it is text, not a comment that runs to the end of the file; a complete comment is still skipped whole.

Corpus: no edge of skywalking-booster-ui or vitepress moved for this issue, and the commented-out and src changes of issues 762 and 763 are not in those repositories.

Correction to the corpus note above: the check shows that no edge moved. It does not show whether those two repositories hold a commented-out script or a src element.

