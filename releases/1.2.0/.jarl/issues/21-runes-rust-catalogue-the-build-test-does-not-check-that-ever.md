# 21 · Runes, Rust catalogue: the build test does not check that every file of a case is compiled, and many merged cases keep their probe in a file no mod declares

**Status:** in-progress
**Kind:** test
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1441-aqry
**Tags:** runes, rust, catalogue
**Files:** 
**Repo:** Runes
**Found by:** w-700-opus
**Where:** Runes/test/relations/rust-cases-build.test.mjs, Runes/test/helpers/rust-fixtures.mjs
**Branch:** jarl/7-rust-scope
**Worker:** w-7-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
A Rust catalogue case builds under cargo check, but rustc reads only the files its crate roots reach through mod; a probe written in a file no mod declares is never compiled, so the build test cannot show that rustc agrees with the edge the case expects for that file. The worker of 700 found many merged cases in that shape.

## Why
A case whose probe rustc never reads can expect an edge rustc would refuse, and the build test still passes.

## Acceptance
[test] The Rust build test fails for a case whose .rs file no crate root reaches (the case lists the files rustc must read, or the test compares the files cargo reports as compiled with the case's files), and every case either passes that check or names the file it keeps out of the build and why; red before and green after · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Evidence

### Proof

- **ran (line 1079f3ae11b6):** node --test test/relations/rust-cases-build.test.mjs (cargo and rustc 1.99.1 from rust:1.99.1-slim through the brief's wrappers) at a4f4fb4 (the check, before the list) · **saw:** tests 6, pass 5, fail 1, skipped 0: rustc read none of 122 files of 86 cases
- **ran (line 1079f3ae11b6):** node --test test/relations/rust-cases-build.test.mjs (cargo and rustc 1.99.1 from rust:1.99.1-slim through the brief's wrappers) at 27ec329 · **saw:** tests 6, pass 6, fail 0, skipped 0
- **ran (line 1079f3ae11b6):** npm run check at 27ec329 · **saw:** tests 2845, pass 2842, fail 0, skipped 3; dist/ is fresh

### Notes

Assumed: the files rustc does not read are listed with their reasons in KEPT_OUT_OF_THE_BUILD (the test's own list, as DO_NOT_BUILD_YET is) rather than marked in the cases, and no case is rewritten: 122 files of 86 cases, of which 42 hold a probe rustc does not compile (20 files of 16 cases no mod declares, 15 with a path naming nothing their crate has, 4 whose path rustc refuses as the case says, 3 in the packages of rust-inline-package-table-crate-name-edge, which has no root manifest and of which the test builds crates/kit alone). The check reads the dep-info files of a target directory per build, passed as --target-dir because the docker wrapper does not forward CARGO_TARGET_DIR.

