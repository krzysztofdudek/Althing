# 700 · Runes: the 46 Rust catalogue cases that do not build under rustc are rewritten so each builds, every expectation change reviewed

**Status:** done
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
**Merged:** d7ff132 in Runes
**Merge check:** npm run check · saw tests 2819, pass 2816, fail 0, skipped 3; dist/ is fresh. Rust build tests under cargo and rustc 1.99.1: tests 4, pass 4, fail 0, skipped 0.

## What
Moved from issue 700 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A catalogue case that does not compile cannot show that rustc agrees with the edge it expects; the build test's list makes each one visible until it is fixed.

## Acceptance
[test] The build test's list of Rust cases that do not build is empty apart from the case unparsable on purpose, and each case whose expectation changed says why in its own text · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Reviews
- **approve** · by rev-700-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh
  Minor (700, reference/relations/rust/rust-edition-2018-src-bench-module-edge.md): with benches/bench.rs added the case no longer tells the editions apart. A resolver that roots a bench at the legacy src/bench.rs in every edition passes it, and under that mutation no Rust case fails at 949d902, where this case failed at the base. Cargo refuses every package in which that edition guard decides anything, so no building fixture can hold it, and the case says so in its Why: this is coverage the build rule costs. Minor (issue 21, not made worse in substance): the six moved probes are named in their Rules, and declaring each file makes rustc refuse it while the resolver answers the same (checked for all six), so those cases stay honest. Six completed cases still keep a probe file that no mod declares and that their Rules do not name, so the build test now calls them built while rustc never reads the lines their Expect is about: rust-crate-path-root-item-of-known-macro-edge (src/api/mod.rs), the four rust-edition-2015-use-crate-root-item cases (src/api/client.rs), and rust-multiline-string-path-dependency-edge (crates/app/src/cmd/run.rs, which builds and keeps both edges once crates/app declares it). rust-lib-path-outside-src-main-module-edge also keeps all of src/cli/run.rs out of the build although rustc refuses only line 2: the declared file builds without that line. Before 700 the build list showed these cases. Now only issue 21 does. Minor (test/helpers/rust-fixtures.mjs importedMacros): a known macro invoked bare goes into the stub of every crate taken with #[macro_use], so the lazy_static and type-macros stubs each define both macros, and a case that takes cfg_if! from an unrelated crate still builds (checked on rust-mod-decl-inside-cfg-if-nested-inline-and-path-edge). The build test cannot catch a macro taken from the wrong crate. Minor (RUSTC_BOOTSTRAP): acceptable on CI. It goes only into the throwaway case directory .cargo/config.toml, only the macros 2.0 case triggers it, and that case says it builds as a nightly compiler reads it. Without it rustc refuses the case with E0554 (checked). The trigger is any #![feature( text in a case source rather than a named case, so a later case could rely on an unstable feature without anyone choosing that. Minor (wording): the Expect comment of rust-inline-bare-root-silence still says the path names a crate the package does not have, which is no longer true. The two lines added to the Rule of rust-use-external-crate-silence are hard-wrapped, continuing a paragraph that already was. Minor (record): the notes say an edge moved to another file in two cases. The diff moves one Expect edge (rust-patch-renamed-package-relative-path-edge); the six moved probes are silence lines. Checked and holding: red at 31d06b1 with 45 broken, green at 949d902 with tests 4 pass 4 skipped 0, npm run check 2779/2776/0/3 with dist fresh. The 41 changed cases plus 4 built by the writer alone, the 14 cases that gained the edges of their added mod lines, no rename and no count change all match. Both autolib cases now fail when the resolver ignores autolib (at the base they passed anyway). Mutations of the patch-relative path, the patch rename and per-target editions fail the same cases at base and tip. The new registry dependencies mask none of the traps (five fixture mutations). The git-source version bump, the two-member split and the cfg(test) import are each needed for Cargo (checked). The six probe moves keep the resolver answer they had where declared.
  outside the issue, filed as 23: Runes, Rust: a module of one of two [[bin]] targets that share a directory outside src/ gives no crate:: edge even where a plain mod chain reaches it from one root only. With tools/a.rs declaring mod cmd; and tools/cmd/mod.rs declaring mod run;, rustc 1.99.1 builds crate::Opts in tools/cmd/run.rs against tools/a.rs, and the resolver stays silent: a lost edge, never a false one. Found while reviewing 700 (rust-several-bins-one-dir-silence with its mod line moved to a); the resolver code is unchanged on that branch.

## Evidence

### Proof

- **ran (line d3deb403ed3b):** node --test test/relations/rust-cases-build.test.mjs (cargo and rustc 1.99.1 on PATH through the rust:1.99.1-slim wrappers) at 31d06b1, the list cut to the unparsable case · **saw:** fail: every Rust case builds ... except the listed ones (45 cases broken); pass 3, fail 1, skipped 0
- **ran (line d3deb403ed3b):** node --test test/relations/rust-cases-build.test.mjs at 949d902 (cargo and rustc 1.99.1 on PATH through the rust:1.99.1-slim wrappers, TMPDIR a mktemp folder) · **saw:** both build tests ran and passed: every Rust case builds except the listed ones (147 s), the listed case still does not build; tests 4, pass 4, fail 0, skipped 0; DO_NOT_BUILD_YET holds only rust-module-of-unparsable-lib-root-item-edge
- **ran (line d3deb403ed3b):** npm run check at 949d902 (under MemoryMax=12G) · **saw:** tests 2779, pass 2776, fail 0, skipped 3 (the two Rust build tests and one other skip without a host toolchain); dist/ is fresh
- **ran (line d3deb403ed3b):** node --test test/relations/rust-cases-build.test.mjs at 31d06b1 in a scratch git-archive tree, cargo and rustc 1.99.1 on PATH through the rust:1.99.1-slim wrappers, TMPDIR a mktemp folder · **saw:** fail: every Rust case builds except the listed ones, 45 cases broken (each named with its rustc or cargo error); the listed case still does not build passed; tests 4, pass 3, fail 1, skipped 0
- **ran (line d3deb403ed3b):** node --test test/relations/rust-cases-build.test.mjs at 949d902 in a scratch git-archive tree, cargo and rustc 1.99.1 on PATH through the rust:1.99.1-slim wrappers, TMPDIR a mktemp folder · **saw:** both build tests ran and passed: every Rust case builds except the listed ones (148 s), the listed case still does not build; tests 4, pass 4, fail 0, skipped 0; DO_NOT_BUILD_YET holds only rust-module-of-unparsable-lib-root-item-edge
- **ran (line d3deb403ed3b):** npm run check at 949d902 in a scratch git-archive tree under MemoryMax=12G; check:dist, which needs git, run again in a git snapshot of that tree · **saw:** tests 2779, pass 2776, fail 0, skipped 3 (the two Rust build tests and the Go oracle, no host toolchain); the build compiler is the pinned one; dist/ is fresh

### Notes

Assumed: a line whose point is a path rustc refuses wherever a crate compiles it (a name a glob does not bring in, two globs, a proc-macro helper attribute imported, a facade root's missing name, a crate:: item a binary lacks) stays in the case in a module file that no mod declares, as 36 cases already merged do, instead of being dropped; six cases, each Rule saying where the probe stands and why, and each probe checked to fail its case when its trap is sprung.

Assumed: where a case's path named a crate the package lacked, the package now depends on a registry crate of that name (renamed with package = where the name is the package's own or a dependency's), which keeps the resolver's answer and lets rustc build the path; nine cases, expectations unchanged.

Assumed: the macros 2.0 case enables #![feature(decl_macro)], and the fixture writer builds a case that enables a language feature with RUSTC_BOOTSTRAP=1 through the stub crates' Cargo configuration, since macro cannot build on a stable compiler otherwise; it is the only such case.

Assumed: no case flipped between edge and silence, so none is renamed and the catalogue count stays; Expect gained the edges of the mod lines a completion adds, and two Rules changed in substance: the edition 2015 bench case's mod helpers now has its file and binds it, and the edition 2018 bench case gets benches/bench.rs, which Cargo requires, so its Why says the two editions root that bench alike wherever the package builds.

