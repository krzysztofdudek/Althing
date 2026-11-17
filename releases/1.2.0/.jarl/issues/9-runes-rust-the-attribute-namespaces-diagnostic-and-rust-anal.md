# 9 · Runes, Rust: the attribute namespaces diagnostic and rust_analyzer emit an in:: use that answers outside

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261117T1233-uhhi
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**Found by:** rev-737-opus
**Where:** Runes/src/relations/extractors/rust.mts, TOOL_ATTRIBUTES (rustfmt, clippy)
**Branch:** jarl/7-rust-scope
**Worker:** w-7-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
After 760, #[diagnostic::on_unimplemented(...)] and #[rust_analyzer::skip] emit in::diagnostic::on_unimplemented and in::rust_analyzer::skip, which classifyUse answers outside, because only rustfmt and clippy are listed as tool attribute namespaces. They name no crate: diagnostic is a built-in attribute namespace and rust_analyzer a tool namespace.

## Why
A consumer that counts uses leaving the repository counts two attribute namespaces as crates, noise in every crate that uses them.

## Acceptance
[test] #[diagnostic::on_unimplemented(...)], #[diagnostic::do_not_recommend] and #[rust_analyzer::skip] give no use, as #[rustfmt::skip] gives none, in a unit test, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- in Rust, `#[diagnostic::on_unimplemented(…)]`, `#[diagnostic::do_not_recommend]` and `#[rust_analyzer::skip]` give no use, as `#[rustfmt::skip]` gives none: `diagnostic` is the compiler's own attribute namespace and `rust_analyzer` a tool's, and neither is a crate, so a consumer that counts uses leaving the repository no longer counts them.

## Reviews
- **changes** · by rev-7-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1636-dydl
  Round at 27ec329, re-run in a fresh scratch clone with cargo and rustc 1.99.1 through the docker wrappers. Verdict: changes, for one Important finding on 21; 8 and 9 meet their lines, and 7 meets its line in substance. Important (21): KEPT_OUT_OF_THE_BUILD is exact for a Linux or macOS build only, and the check fails both ways (an unread file not listed, a listed file read). Its CFG_OFF entries name the files of the branch that is off where unix holds, so the Windows job of CI, which runs this build test (issue 28), goes red. With cfg(unix) and cfg(windows) swapped in every Rust case, every case builds and the check fails on 7 files of 5 cases. Also, release/1.2.0 is now at 4922b8b: 659eca8 gives rust-module-in-cfg-if-of-lib-root-item-edge a src/other/mod.rs under the else branch of cfg(unix), so after the merge the check fails on Linux too (reproduced). A file kept out by a target cfg has to be listed per target, or accepted as read or unread wherever its cfg decides, and release/1.2.0 merged in. Minor (7, the line's wording): two clauses of line 1 are not met as written, and both departures are sound. use datacrate::dc; beside a branch's mod datacrate; with that path dependency is refused by rustc 1.99.1 (E0659, reproduced), so only the unit test can hold it; through the resolver it binds src/datacrate.rs and gives no edge to the dependency. imp::g() through the branch's alias gives no use, not resolved src/unix.rs; an alias written outside the macro gives none either, at release/1.2.0 and at the tip. rustc binds it to src/unix.rs, so an answer is missed but none is false, and mod unix; carries the module's edge. The director should reword the line, and file resolving an inline path through a local alias as its own issue if it is wanted. Minor (7): a name a branch binds to a crate now silences that crate's inline paths while the branch's use gives no use itself (32, deferred). After cfg_if! { if #[cfg(any(unix, windows))] { use dep; } }, dep::v() (rustc binds the path dependency dep) answered resolved dep/src/lib.rs at release/1.2.0 and gives no use at the tip, so the file loses its edge to dep. A glob in a branch (pub use self::unix::*) likewise now silences every inline path of its module, a path dependency's included, as the 760 rule for a glob outside the macro does and as the changelog says. v1.1.0 read neither form. Minor (21): the reason given for crates/app/src/cmd/run.rs in rust-inline-package-table-crate-name-edge says only that the build compiles crates/kit alone, but app has no crate root at all. The other sampled reasons are true, and crates/kit/src/lib.rs is rightly a decoy. 21's check can fail (red at a4f4fb4 on 122 files of 86 cases). npm run check: 2845 tests, 0 failed, 3 skipped; the build tests: 6 passed, 0 skipped; dist/ is fresh; ripgrep (480 edges) and react (10801) are unchanged; rev 28 to 30 and catalogue 1009 are in place.
  outside the issue, filed as 33: Runes, Rust catalogue: 20 files of 16 merged cases hold the edge probe their case expects in a file no mod declares (KEPT_OUT_OF_THE_BUILD's 'a fixture to complete'), and 5 more files hold expected edge lines beside a path that names nothing, so rustc never checks those edges; declare each probe where its case means it, and move a line rustc refuses into a file of its own

## Evidence

### Proof

- **ran (line 76fb540de8bd):** node --test --test-name-pattern 'diagnostic namespace' test/relations/extractors/rust.test.mjs at 9db84b8 (before the fix) · **saw:** fail 1: expected only in::tokio::main@9, got in::diagnostic::on_unimplemented@1, in::diagnostic::do_not_recommend@3, in::rust_analyzer::skip@5 too
- **ran (line 76fb540de8bd):** npm run check at 27ec329 · **saw:** tests 2845, pass 2842, fail 0, skipped 3; dist/ is fresh
- **ran (line 76fb540de8bd):** at 9db84b8 (before the fix), in a scratch clone: node --test --test-name-pattern 'diagnostic namespace' test/relations/extractors/rust.test.mjs · **saw:** tests 1, fail 1: expected only in::tokio::main@9, got in::diagnostic::on_unimplemented@1, in::diagnostic::do_not_recommend@3 and in::rust_analyzer::skip@5 too
- **ran (line 76fb540de8bd):** at 27ec329: npm run check, and uses() of diagnostic::report() and rust_analyzer::x() written outside an attribute · **saw:** tests 2845, pass 2842, fail 0, skipped 3, the diagnostic namespace test among the passes; outside an attribute both still give in::diagnostic::report and in::rust_analyzer::x, as at release/1.2.0

