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
- A Vue or Svelte component whose script is an external file, `<script src="../data/d.ts"></script>`, now gives a use of that file at the line of the element, so the component depends on it. This can show new findings: a consumer's graph that forbids or lacks that dependency now reports the component. A tag that runs over lines, with no room for the import on its first line, still gives no use.

## Evidence

### Proof

- **ran (line 83acff0e947e):** npm run build && node --test test/relations/extractors/typescript.test.mjs · **saw:** tests 44, pass 42, fail 2: the two tests that expect a use of the src file at its element's line failed; the tests that pin the bodied, tall and no-file cases passed before the change
- **ran (line 83acff0e947e):** npm run build && node --test test/relations/extractors/typescript.test.mjs test/relations/extractor-rev.test.mjs test/relations/extractors/typescript-name-resolution-matrix.test.mjs test/relations/extractors/javascript-name-resolution-matrix.test.mjs test/exports.test.mjs · **saw:** tests 214, pass 214, fail 0
- **ran (line 83acff0e947e):** npm run check · **saw:** tests 2762, pass 2759, fail 0, skipped 3 (the Go oracle without go, and the two Rust build tests without a toolchain); dist/ is fresh. npm run coverage: lines 99.21, branches 95.88, functions 99.03, thresholds 98, 92 and 97

### Notes

Assumed: a body that is only whitespace counts as no body, since a browser loads the file of a src element and ignores its body; a tag that runs over lines with no room for the import on its first line gives no use, so the lines of the component do not move.

Corpus: no edge of skywalking-booster-ui or vitepress moved for this issue.

