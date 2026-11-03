# 481 · Runes: in an edition 2015 package, a declared [[test]], [[example]] or [[bench]] also turns auto-discovery of its kind off

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 472
**Found by:** w-runes-472-sonnet
**Where:** The 472 worker's report (2026-11-03); The Cargo Book, Cargo Targets: for packages with the 2015 edition, the default for auto-discovery is false if at least one target is manually defined
**Branch:** jarl/481-cargo-2015-targets
**Worker:** w-runes-481-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-481
**Since:** 2026-11-03 03:00

## What
472 applies the 2015 rule to bins only. Applied to tests it changes the case rust-target-paths-shared-dir-silence (a [[test]] with tests/common/mod.rs), which needs deciding again.

## Why
Files Cargo does not build read as crate roots give false edges in old crates.

## Acceptance
The 2015 rule covers tests, examples and benches, with a case per kind red before and green after, and rust-target-paths-shared-dir-silence is decided again with its Rule saying why

## Changelog
- Fixed: Rust: in an edition 2015 package (also one that gives no `edition`), a declared `[[test]]`, `[[example]]` or `[[bench]]` turns off auto-discovery of its kind, as it already did for `[[bin]]`: an undeclared `tests/*.rs`, `examples/*.rs` or `benches/*.rs` is no crate root and gives no edges, and a helper such as `tests/common/mod.rs` binds the one declared test root beside it. This can remove edges from a consumer's graph.

## Evidence

- **ran:** nice -n 15 node --test --test-name-pattern='declared-(test|example|bench)|shared-dir' test/relations/extractors/rust-name-resolution-matrix.test.mjs (before the fix, on release/1.1.0's resolver) · **saw:** pass 1, fail 4: unexpected cross-owner edge tests/smoke.rs:1->helpers, examples/demo.rs:1->support, benches/parse.rs:1->inputs; expected edge tests/common/mod.rs:1->tests not emitted
- **ran:** the same command after commit 3637954 · **saw:** 5 of 5 pass: the three declared-<kind>-undiscovered-silence cases, rust-edition-2015-declared-test-common-module-edge, and rust-target-paths-shared-dir-silence (now edition 2018)
- **ran:** nice -n 15 npm run check; nice -n 15 npm run coverage; nice -n 15 node scripts/corpus.mjs verify --tier all (branch tip addc5ba) · **saw:** check: 2039 pass, 0 fail, dist/ is fresh; coverage: 99.02 lines, 94.93 branches, 98.93 functions; corpus: 33 repositories passed, no golden changed

