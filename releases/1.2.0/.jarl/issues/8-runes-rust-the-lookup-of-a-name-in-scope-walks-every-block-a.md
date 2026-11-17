# 8 · Runes, Rust: the lookup of a name in scope walks every block around the use declaration or path it …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1232-xsvb
**Tags:** performance, runes, rust
**Files:** 
**Repo:** Runes
**Found by:** rev-737-opus
**Where:** the review of 737, 759, 760
**Branch:** jarl/7-rust-scope
**Worker:** w-7-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
Runes, Rust: the lookup of a name in scope walks every block around the use declaration or path it reads, so a file of deeply nested blocks reads in time that grows with the square of its depth: 16000 nested blocks with one use declaration each take 42 s at v1.1.0 (37 s at the 760 branch), and with one bare path each 5.8 s at the 760 branch against 0.18 s at v1.1.0; the ancestor-walk test counts tree accesses only, so it does not see this cost

## Why


A crafted or generated file can stall every consumer that reads the repository, against the extractors' linear-time guarantee.

## Acceptance


[test] A Rust file of 16000 nested blocks, with one use declaration each and with one bare path each, is read in linear time, in a test bounded in time in the style of the extractor's existing linear-time tests, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- in Rust, a file of deeply nested blocks is read in time linear in its depth: 16 000 nested blocks with a `use` in each took 42 s in 1.1.0 and now take a fraction of a second, and the same holds for a path written outside a `use` in each. No finding changes.

## Reviews
- **changes** · by rev-7-opus (fresh) · 2026-11-17 · model claude-opus-5-5@xhigh · batch 20261117T1636-dydl
  Round at 27ec329, re-run in a fresh scratch clone with cargo and rustc 1.99.1 through the docker wrappers. Verdict: changes, for one Important finding on 21; 8 and 9 meet their lines, and 7 meets its line in substance. Important (21): KEPT_OUT_OF_THE_BUILD is exact for a Linux or macOS build only, and the check fails both ways (an unread file not listed, a listed file read). Its CFG_OFF entries name the files of the branch that is off where unix holds, so the Windows job of CI, which runs this build test (issue 28), goes red. With cfg(unix) and cfg(windows) swapped in every Rust case, every case builds and the check fails on 7 files of 5 cases. Also, release/1.2.0 is now at 4922b8b: 659eca8 gives rust-module-in-cfg-if-of-lib-root-item-edge a src/other/mod.rs under the else branch of cfg(unix), so after the merge the check fails on Linux too (reproduced). A file kept out by a target cfg has to be listed per target, or accepted as read or unread wherever its cfg decides, and release/1.2.0 merged in. Minor (7, the line's wording): two clauses of line 1 are not met as written, and both departures are sound. use datacrate::dc; beside a branch's mod datacrate; with that path dependency is refused by rustc 1.99.1 (E0659, reproduced), so only the unit test can hold it; through the resolver it binds src/datacrate.rs and gives no edge to the dependency. imp::g() through the branch's alias gives no use, not resolved src/unix.rs; an alias written outside the macro gives none either, at release/1.2.0 and at the tip. rustc binds it to src/unix.rs, so an answer is missed but none is false, and mod unix; carries the module's edge. The director should reword the line, and file resolving an inline path through a local alias as its own issue if it is wanted. Minor (7): a name a branch binds to a crate now silences that crate's inline paths while the branch's use gives no use itself (32, deferred). After cfg_if! { if #[cfg(any(unix, windows))] { use dep; } }, dep::v() (rustc binds the path dependency dep) answered resolved dep/src/lib.rs at release/1.2.0 and gives no use at the tip, so the file loses its edge to dep. A glob in a branch (pub use self::unix::*) likewise now silences every inline path of its module, a path dependency's included, as the 760 rule for a glob outside the macro does and as the changelog says. v1.1.0 read neither form. Minor (21): the reason given for crates/app/src/cmd/run.rs in rust-inline-package-table-crate-name-edge says only that the build compiles crates/kit alone, but app has no crate root at all. The other sampled reasons are true, and crates/kit/src/lib.rs is rightly a decoy. 21's check can fail (red at a4f4fb4 on 122 files of 86 cases). npm run check: 2845 tests, 0 failed, 3 skipped; the build tests: 6 passed, 0 skipped; dist/ is fresh; ripgrep (480 edges) and react (10801) are unchanged; rev 28 to 30 and catalogue 1009 are in place.
  outside the issue, filed as 33: Runes, Rust catalogue: 20 files of 16 merged cases hold the edge probe their case expects in a file no mod declares (KEPT_OUT_OF_THE_BUILD's 'a fixture to complete'), and 5 more files hold expected edge lines beside a path that names nothing, so rustc never checks those edges; declare each probe where its case means it, and move a line rustc refuses into a file of its own

## Evidence

### Proof

- **ran (line f690de6280d4):** node --test --test-name-pattern '16 000 nested' test/relations/extractors/rust.test.mjs at bfa8e0e (before the fix) · **saw:** fail 2: a quarter of the depth took 1857 ms, the whole of it 35072 ms (a use in each block); 283 ms and 5133 ms (a path in each)
- **ran (line f690de6280d4):** npm run check at 27ec329 · **saw:** tests 2845, pass 2842, fail 0, skipped 3; dist/ is fresh; 16000 blocks read in about 180 ms (use) and 190 ms (path)
- **ran (line f690de6280d4):** at bfa8e0e (before the fix), in a scratch clone: node --test --test-name-pattern '16 000 nested' test/relations/extractors/rust.test.mjs · **saw:** tests 2, pass 0, fail 2: a quarter of the depth took 2108 ms, the whole of it 55669 ms (a use in each block); 351 ms and 4738 ms (a path in each)
- **ran (line f690de6280d4):** the same at 27ec329 · **saw:** tests 2, pass 2, fail 0, about 600 ms per test for both reads at both depths; the ratio and its 50 ms floor are those of the wide-node test
- **ran (line f690de6280d4):** at 27ec329: npm run check; corpus verify for ripgrep and react; uses() of eight scope scenarios (nested aliases through three blocks, sibling blocks, a block's struct shadowing a module alias, an extern crate under a block's mod) at release/1.2.0 4922b8b and at the tip · **saw:** tests 2845, pass 2842, fail 0, skipped 3; dist/ identical to the rebuild; ripgrep 480 and react 10801 edges unchanged; every scenario gives the same uses at both commits

