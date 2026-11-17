# 7 · Runes, Rust: a module declared in a cfg_if! branch, and a use written in one, is no name in scope o…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1232-svav
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**Found by:** rev-737-opus
**Where:** the review of 737, 759, 760
**Branch:** jarl/7-rust-scope
**Worker:** w-7-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
Runes, Rust: a module declared in a cfg_if! branch, and a use written in one, is no name in scope of its module, so a use path (since 1.1.0) and, from 1.2.0, a path outside a use that starts with that name read the crate of the name: with a path dependency datacrate whose root declares dc, cfg_if! { if #[cfg(unix)] { mod datacrate; } } beside use datacrate::dc; (1.1.0) or datacrate::dc(1u8) (the 760 branch) gives an edge to datacrate/src/lib.rs, while rustc 1.99.1 binds the local src/datacrate.rs; with no dependency of that name, imp::g() through cfg_if! { if #[cfg(unix)] { mod unix; use unix as imp; } } answers absent outside instead of resolved src/unix.rs

## Why


A lost true edge, or a false one, misleads every consumer that checks dependencies with the readers.

## Acceptance


[test] A module declared and a use written in a cfg_if! branch are names in scope of their module, so datacrate::dc(1u8) beside cfg_if! { if #[cfg(unix)] { mod datacrate; } } binds src/datacrate.rs and gives no edge to a path dependency of that name (use datacrate::dc; in that shape, which rustc 1.99.1 refuses with E0659, is covered by a unit test), and a path through a use alias in such a branch gives no edge to a crate of the alias's name; catalogue cases that build under rustc, red before and green after; every existing answer and edge stays as it is · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Changelog
- in Rust, a module a `cfg_if!` branch declares and a name a `use` there binds are names in scope of their module, as when written outside the macro: `use imp::g;` after `cfg_if! { if #[cfg(unix)] { mod unix; use unix as imp; } }` gives an edge to `src/unix.rs`, where 1.1.0 read `imp` as a crate and gave none, and a path written outside a `use` that starts with such a name (`datacrate::dc()` beside a branch that declares `mod datacrate;`) gives no edge to a path dependency of that name. A glob `use` in a branch may bring in any name, so a path under it gives no edge. This can show new findings from a platform layer to its modules.

## Reviews
- **changes** · by rev-7-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1636-dydl
  Round at 27ec329, re-run in a fresh scratch clone with cargo and rustc 1.99.1 through the docker wrappers. Verdict: changes, for one Important finding on 21; 8 and 9 meet their lines, and 7 meets its line in substance. Important (21): KEPT_OUT_OF_THE_BUILD is exact for a Linux or macOS build only, and the check fails both ways (an unread file not listed, a listed file read). Its CFG_OFF entries name the files of the branch that is off where unix holds, so the Windows job of CI, which runs this build test (issue 28), goes red. With cfg(unix) and cfg(windows) swapped in every Rust case, every case builds and the check fails on 7 files of 5 cases. Also, release/1.2.0 is now at 4922b8b: 659eca8 gives rust-module-in-cfg-if-of-lib-root-item-edge a src/other/mod.rs under the else branch of cfg(unix), so after the merge the check fails on Linux too (reproduced). A file kept out by a target cfg has to be listed per target, or accepted as read or unread wherever its cfg decides, and release/1.2.0 merged in. Minor (7, the line's wording): two clauses of line 1 are not met as written, and both departures are sound. use datacrate::dc; beside a branch's mod datacrate; with that path dependency is refused by rustc 1.99.1 (E0659, reproduced), so only the unit test can hold it; through the resolver it binds src/datacrate.rs and gives no edge to the dependency. imp::g() through the branch's alias gives no use, not resolved src/unix.rs; an alias written outside the macro gives none either, at release/1.2.0 and at the tip. rustc binds it to src/unix.rs, so an answer is missed but none is false, and mod unix; carries the module's edge. The director should reword the line, and file resolving an inline path through a local alias as its own issue if it is wanted. Minor (7): a name a branch binds to a crate now silences that crate's inline paths while the branch's use gives no use itself (32, deferred). After cfg_if! { if #[cfg(any(unix, windows))] { use dep; } }, dep::v() (rustc binds the path dependency dep) answered resolved dep/src/lib.rs at release/1.2.0 and gives no use at the tip, so the file loses its edge to dep. A glob in a branch (pub use self::unix::*) likewise now silences every inline path of its module, a path dependency's included, as the 760 rule for a glob outside the macro does and as the changelog says. v1.1.0 read neither form. Minor (21): the reason given for crates/app/src/cmd/run.rs in rust-inline-package-table-crate-name-edge says only that the build compiles crates/kit alone, but app has no crate root at all. The other sampled reasons are true, and crates/kit/src/lib.rs is rightly a decoy. 21's check can fail (red at a4f4fb4 on 122 files of 86 cases). npm run check: 2845 tests, 0 failed, 3 skipped; the build tests: 6 passed, 0 skipped; dist/ is fresh; ripgrep (480 edges) and react (10801) are unchanged; rev 28 to 30 and catalogue 1009 are in place.
  outside the issue, filed as 33: Runes, Rust catalogue: 20 files of 16 merged cases hold the edge probe their case expects in a file no mod declares (KEPT_OUT_OF_THE_BUILD's 'a fixture to complete'), and 5 more files hold expected edge lines beside a path that names nothing, so rustc never checks those edges; declare each probe where its case means it, and move a line rustc refuses into a file of its own

## Evidence

### Proof

- **ran (line df79be71708a):** node --test test/relations/extractors/rust.test.mjs test/relations/extractors/rust-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs at e01f322 (before the fix) · **saw:** tests 287, pass 284, fail 3: rust-cfg-if-module-and-use-are-names-in-scope-edge expected src/lib.rs:8->unix, got src/lib.rs:10->datacrate; the two cfg_if! names-in-scope unit tests
- **ran (line df79be71708a):** npm run check at 27ec329 · **saw:** tests 2845, pass 2842, fail 0, skipped 3; dist/ is fresh
- **ran (line df79be71708a):** node --test test/relations/rust-cases-build.test.mjs (cargo and rustc 1.99.1 from rust:1.99.1-slim through the brief's wrappers) at 27ec329 · **saw:** tests 6, pass 6, fail 0, skipped 0; rust-cfg-if-module-and-use-are-names-in-scope-edge builds
- **ran (line df79be71708a):** at e01f322 (before the fix), in a scratch clone: node --test test/relations/extractors/rust.test.mjs test/relations/extractors/rust-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs · **saw:** tests 287, pass 284, fail 3: rust-cfg-if-module-and-use-are-names-in-scope-edge (expected src/lib.rs:8->unix, got src/lib.rs:3->local, 4->unix, 10->datacrate, src/unix.rs:3->store) and the two cfg_if! names-in-scope unit tests
- **ran (line df79be71708a):** at 27ec329: npm run check; node scripts/corpus.mjs verify --only ripgrep,react with RUNES_CORPUS_DIR on the shared corpus · **saw:** tests 2845, pass 2842, fail 0, skipped 3 (the real-go oracle and the two Rust build tests, which run in the next row); the rebuilt dist/ is identical to the committed one (diff -r, the scratch tree has no .git for check:dist); ripgrep 480 edges and react 10801, 0 added, 0 removed
- **ran (line df79be71708a):** at 27ec329, cargo and rustc 1.99.1 from rust:1.99.1-slim through the brief's docker wrappers first on PATH: node --test test/relations/rust-cases-build.test.mjs · **saw:** tests 6, pass 6, fail 0, skipped 0; the new case builds
- **ran (line df79be71708a):** rustc 1.99.1 on scratch crates, and caseEdges of the catalogue runner on a scratch case at 27ec329 and at release/1.2.0 4922b8b · **saw:** use datacrate::dc; beside a cfg_if! mod datacrate; with a path dependency datacrate: rustc E0659 (ambiguous); the tip binds src/datacrate.rs and gives no edge to the dependency. datacrate::dc(1u8): rustc builds it bound to src/datacrate.rs, the tip gives no use (release/1.2.0: an edge to datacrate). imp::g() through the branch's alias: rustc builds it bound to src/unix.rs, the tip gives no use where the line says resolved src/unix.rs, as imp2::g() through an alias written outside the macro gives none at both commits. dep::v() after a branch's use dep;: rustc binds the path dependency dep, release/1.2.0 answers resolved dep/src/lib.rs, the tip gives no use

### Notes

Assumed: the line's two halves meet where the reader's design already stands. imp::g() (a path outside a use) through an alias bound in a cfg_if! branch now gives no use, as the same call through an alias written outside the macro gives none (the extractor emits nothing for a path whose first name is bound in scope, so no path outside a use ever answers resolved); before it answered absent outside. The resolved src/unix.rs answer is shown by use imp::g; in the case. use datacrate::dc; beside a cfg_if! mod datacrate; with a path dependency of that name is refused by rustc 1.99.1 (E0659, a macro-expanded name may not shadow a crate of the extern prelude during import resolution), so no building case holds it: the unit test shows the extractor emits use::2::self::datacrate::datacrate::dc for it, and the case shows datacrate::dc(1u8) gives no edge to the dependency, which rustc binds to src/datacrate.rs (the case's let () = ... fails to build against the crate's u32).

