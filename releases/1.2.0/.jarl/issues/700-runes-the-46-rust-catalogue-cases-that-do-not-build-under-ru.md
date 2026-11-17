# 700 · Runes: the 46 Rust catalogue cases that do not build under rustc are rewritten so each builds, every expectation change reviewed

**Status:** in-progress
**Kind:** test
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1032-ovqz
**Tags:** runes, rust, catalogue
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-645-sonnet, 651 (ruling rust-fixtures-build-list)
**Branch:** jarl/700-rust-cases-build
**Worker:** w-700-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 13:52

## What
Moved from issue 700 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A catalogue case that does not compile cannot show that rustc agrees with the edge it expects; the build test's list makes each one visible until it is fixed.

## Acceptance
[test] The build test's list of Rust cases that do not build is empty apart from the case unparsable on purpose, and each case whose expectation changed says why in its own text · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Evidence

### Proof

- **ran (line d3deb403ed3b):** node --test test/relations/rust-cases-build.test.mjs (cargo and rustc 1.99.1 on PATH through the rust:1.99.1-slim wrappers) at 31d06b1, the list cut to the unparsable case · **saw:** fail: every Rust case builds ... except the listed ones (45 cases broken); pass 3, fail 1, skipped 0
- **ran (line d3deb403ed3b):** node --test test/relations/rust-cases-build.test.mjs at 949d902 (cargo and rustc 1.99.1 on PATH through the rust:1.99.1-slim wrappers, TMPDIR a mktemp folder) · **saw:** both build tests ran and passed: every Rust case builds except the listed ones (147 s), the listed case still does not build; tests 4, pass 4, fail 0, skipped 0; DO_NOT_BUILD_YET holds only rust-module-of-unparsable-lib-root-item-edge
- **ran (line d3deb403ed3b):** npm run check at 949d902 (under MemoryMax=12G) · **saw:** tests 2779, pass 2776, fail 0, skipped 3 (the two Rust build tests and one other skip without a host toolchain); dist/ is fresh

### Notes

Assumed: a line whose point is a path rustc refuses wherever a crate compiles it (a name a glob does not bring in, two globs, a proc-macro helper attribute imported, a facade root's missing name, a crate:: item a binary lacks) stays in the case in a module file that no mod declares, as 36 cases already merged do, instead of being dropped; six cases, each Rule saying where the probe stands and why, and each probe checked to fail its case when its trap is sprung.

Assumed: where a case's path named a crate the package lacked, the package now depends on a registry crate of that name (renamed with package = where the name is the package's own or a dependency's), which keeps the resolver's answer and lets rustc build the path; nine cases, expectations unchanged.

Assumed: the macros 2.0 case enables #![feature(decl_macro)], and the fixture writer builds a case that enables a language feature with RUSTC_BOOTSTRAP=1 through the stub crates' Cargo configuration, since macro cannot build on a stable compiler otherwise; it is the only such case.

Assumed: no case flipped between edge and silence, so none is renamed and the catalogue count stays; Expect gained the edges of the mod lines a completion adds, and two Rules changed in substance: the edition 2015 bench case's mod helpers now has its file and binds it, and the edition 2018 bench case gets benches/bench.rs, which Cargo requires, so its Why says the two editions root that bench alike wherever the package builds.

