# 20 · TypeScript and JavaScript components: sfcScriptView takes quadratic time on a run of script opening…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1351-lbds
**Tags:** performance, runes, typescript
**Files:** 
**Repo:** Runes
**Found by:** rev-762-opus
**Where:** the review of 762
**Branch:** jarl/755-bundler-alias
**Worker:** w-755-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 13:52

## What
TypeScript and JavaScript components: sfcScriptView takes quadratic time on a run of script opening tags that never reach a > ('<script ' or '<script a="' repeated): 256 KB takes about 3.4 s at v1.1.0 and 6.3 s at the 1.2.0 branch, since each <script retries the opening-tag pattern to the end of the file; once one attempt finds no >, no later one can match

## Why


A crafted or damaged component can stall every consumer that reads the repository, against the extractor's linear-time guarantee.

## Acceptance


[test] A Vue or Svelte component holding a long run of <script openings with no > (both '<script ' and '<script a="' repeated, 1 MB) is read in linear time, in a test bounded in the style of the extractor's existing linear-time tests, red before and green after; every existing answer stays as it is · by: npm run check

## Changelog
- A Vue or Svelte component holding a long run of `<script` openings with no `>` after them (`<script ` or `<script a="` repeated, as a crafted or damaged file may) is now read in linear time; in 1.1.0 256 KB of it took seconds and the time grew with the square of its size. No finding changes.

## Evidence

### Proof

- **ran (line ec95c1b18015):** node --test --test-name-pattern='openings with attributes' test/relations/extractors/typescript.test.mjs, at dba567a (test only) · **saw:** red: fail 1; the first component, 1 MB of '<script ' in a .vue file, took about 70 s against the 15 s bound
- **ran (line ec95c1b18015):** node --test test/relations/extractors/typescript.test.mjs and the TypeScript and JavaScript matrices, at the fix commit · **saw:** green: pass 211, fail 0; 1 MB of '<script ' and of '<script a="' in .vue and .svelte, and the run closed by one >, read in 86 ms in all; every existing sfcScriptView test unchanged
- **ran (line ec95c1b18015):** npm run check at 29c0bd4 · **saw:** tests 2848, pass 2845, fail 0, skipped 3 (the two Rust build tests without a toolchain, and one more skip as on the release branch); dist/ is fresh

### Notes

The three skips of npm run check at 29c0bd4 are the two Rust build tests (no rustc or cargo 1.99.1 here) and the Go oracle test (go is not installed); none touches the TypeScript reader.

