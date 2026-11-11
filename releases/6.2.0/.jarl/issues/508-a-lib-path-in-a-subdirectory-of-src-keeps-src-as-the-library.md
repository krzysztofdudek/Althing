# 508 · A [lib] path in a subdirectory of src/ keeps src/ as the library's module root

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0440-fvbm
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/resolve-path.mts, Runes/src/relations/extractors/rust-resolve.mts
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-libsubdr
**Where:** src/relations/resolve-path.mts:449
**Branch:** jarl/507-rust-roots
**Merged:** 616751af8520ca224363828f4b608cffee5dad5c in Runes
**Merge check:** npm run check · saw tests 2107, pass 2106, fail 0, skipped 1; dist/ is fresh

## What
Claim: rustTargetFor gives every non-root file under src/ the tree srcDir 'src' with root files [libRoot, src/main.rs], even when the library root is src/<dir>/lib.rs. crate:: paths from the library's modules then probe src/ instead of the library's directory, falling back to the library root file or to a same-named module of the binary.

p01 ([lib] path = "src/core/lib.rs"): src/core/engine/mod.rs:1 -> node:core instead of node:util; the edge into the root closes a cycle with src/core/lib.rs:1 -> node:engine. p02 (with src/main.rs declaring its own `mod util;`): src/core/engine/mod.rs:1 -> node:bin_util, the binary's module. Cargo targets.rs normalize_lib takes lib.path as written; Rust Reference, Modules: a crate root's `mod x;` is beside it. Same output at v1.0.0.

## Why


## Acceptance
- [test] When the [lib] path lies in a subdirectory of src/, a file under that subdirectory resolves crate:: paths against the library's own directory, with the audit's p01 and p02 as catalogue cases, red before and green after · by: npm run check
- [test] The Rust tests are unchanged apart from the new cases · by: npm run check

## Changelog
- A Cargo package that writes `edition = { workspace = true }` now takes the workspace edition, so its bare `use` paths name registry crates and its auto-discovered binaries and benches keep their edges; a library whose `[lib]` path lies in a subdirectory of `src/` resolves `crate::` paths against that subdirectory. A consumer's graph can show edges it did not show before and lose edges it showed wrongly.

## Reviews
- **approve** · by rev-507b-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T0951-juaj
  Minor: Runes src/relations/resolve-path.mts:393, the doc comment of rustTargetFor still says a file under src/ keeps the auto-discovered targets and does not say that a library whose path lies in a subdirectory of src/ now takes the files below that subdirectory alone (the rule is only in the inline comment at :463). Minor: commit 84fbd46 carries both fixes, for 507 and 508, so neither can be reverted alone; the lease is joint and the hunks touch one file, so this is no reason for a round. 507 line 1 [read] 'edition = { workspace = true } reads the workspace's edition exactly as edition.workspace = true does, with the audit's probe and the sceptic's bench probe as catalogue cases, red before and green after': met. The inline spelling gives the same edges as the dotted one with a 2021 workspace (probes: [package] inline, compact with a trailing comma, with a trailing comment, the whole package written as one inline table, the workspace edition written as an inline package table) and with a 2015 workspace (both spellings give the crate-relative edge, so the value is read, not only 'not 2015'). p10, p51, p40 and the bench probe s40 are the four edition cases; on the base code with the final cases all four fail for the issue's reasons (client.rs:1->config, jobs/mod.rs:1->root, no edge from the worker bin and the render bench) and pass on 84fbd46. 507 line 2 [read] 'The Rust tests are unchanged apart from the new cases, and the corpus goldens do not change': met; only the six runCase lines and the catalogue count 675 -> 681 changed, no corpus file moved. 508 lines 1 and 2 re-run (rows recorded): 2106 pass, 0 fail; both library cases red on base code, green after; rebuilt dist identical to the committed one. Extra probes: a library at ./src/core/lib.rs and at src/a/b/lib.rs with a decoy util in src/a/ resolve against the library's directory; a module of src/main.rs outside the library's directory keeps the binary's tree. Not a guard change, so nothing to attack.

## Evidence

### Proof

- **ran (line 16436722cccf):** nice -n 15 npm run check · **saw:** 2106 tests pass, 0 fail; the six new Rust catalogue cases fail without the fix and pass with it; dist is fresh
- **ran (line d6ca54816aea):** nice -n 15 npm run check · **saw:** 2106 tests pass, 0 fail; no existing Rust case changed, only the six new ones were added
- **ran (line 16436722cccf):** git archive 84fbd46 into a scratch folder; npm ci; nice -n 15 npm run build; npm run grammars; nice -n 15 node --test --test-concurrency=4 'test/**/*.test.mjs' (npm run check's test step, capped at four processes); rebuilt dist compared with diff -r to the committed dist (check:dist needs git, absent in an extraction). Red: base release/1.1.0 resolve-path.mts dropped into the 84fbd46 tree, rebuilt, the Rust matrix and catalogue suites run · **saw:** 84fbd46: 2107 tests, 2106 pass, 0 fail, 1 skipped (the Go oracle, go not installed); rebuilt dist identical to the committed dist. Base code with the final cases: 6 fail, 93 pass; rust-lib-path-in-src-subdir-crate-path-edge: expected src/core/engine/mod.rs:1->util, got ->core; rust-lib-path-in-src-subdir-beside-main-crate-path-edge: expected ->util, got ->bin_util; both green on 84fbd46
- **ran (line d6ca54816aea):** git diff release/1.1.0...jarl/507-rust-roots -- test reference corpus; the same full suite run at 84fbd46 (node --test --test-concurrency=4 'test/**/*.test.mjs') · **saw:** test changes: six new runCase lines in rust-name-resolution-matrix.test.mjs and the catalogue count 675 -> 681 in catalogue.test.mjs; six new reference cases; no existing Rust case and no corpus golden changed; suite 2106 pass, 0 fail

