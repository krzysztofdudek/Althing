# 484 · Runes: Cargo 2015 target rules left after 472 (a bin name shared with an inferred target, bin = [], a library found only at src/<libname>.rs)

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 472
**Found by:** rev-runes-472b-opus
**Where:** Review of 472 round 1 (2026-11-03), against Cargo 0.85.0 targets.rs
**Branch:** jarl/481-cargo-2015-targets
**Worker:** w-runes-481-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-481
**Since:** 2026-11-03 03:00

## What
When two inferred targets share a bin's name, Cargo takes the legacy path; an empty bin = [] turns bin discovery off; a 2015 library found only at its legacy path src/<libname>.rs does not count as having a library for the bin fallbacks.

## Why
Each misplaces a crate root in old crates, which gives false or lost edges.

## Acceptance
Each of the three rules matches Cargo's targets.rs, with a catalogue case each, red before and green after

## Changelog
- Fixed: Rust: in an edition 2015 package, `bin = []` turns bin auto-discovery off; a `[[bin]]` with no `path` whose name two inferred files share is rooted at its legacy path; and a `[lib]` with no `path` and no `src/lib.rs` is found at `src/<name>.rs` and counts as the package's library for the bin fallbacks. This can move or remove edges in a consumer's graph.

## Evidence

- **ran:** nice -n 15 node --test --test-name-pattern='empty-bin-array|shared-name|legacy-lib-path' test/relations/extractors/rust-name-resolution-matrix.test.mjs (before the fixes) · **saw:** fail 3: unexpected cross-owner edge src/main.rs:1->tools (empty bin array); expected edge src/cli.rs:1->tools not emitted (shared name); expected edge src/app.rs:1->tools not emitted (legacy lib)
- **ran:** each case's runCase after its commit (12c414e, aeb1f6a, addc5ba) · **saw:** rust-edition-2015-empty-bin-array-main-silence, rust-edition-2015-legacy-bin-path-shared-name-edge and rust-edition-2015-legacy-lib-path-edge pass
- **ran:** nice -n 15 npm run check; nice -n 15 npm run coverage; nice -n 15 node scripts/corpus.mjs verify --tier all (branch tip addc5ba) · **saw:** check: 2039 pass, 0 fail, dist/ is fresh; coverage: all files 99.02 lines, 94.93 branches, 98.93 functions; corpus: 33 repositories passed, no golden changed

