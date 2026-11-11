# 524 · Edition 2015 legacy_bench_path is not modelled

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-axkb
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-benchleg
**Where:** src/relations/resolve-path.mts:262
**Branch:** jarl/509-cargo-targets
**Worker:** w-509-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:54

## What
Claim: In edition 2015 Cargo roots a [[bench]] named bench with no path at src/bench.rs when no benches/bench.rs exists. Runes models the legacy paths of binaries only, so src/bench.rs is read as a module of the library and its `mod x;` is looked for under src/bench/.

p09: silence; Rust gives src/bench.rs:1 -> node:helpers (src/helpers/mod.rs). Cargo targets.rs normalize_benches, legacy_bench_path. Same at v1.0.0.

## Why


## Acceptance
- [test] In edition 2015, a [[bench]] named bench that gives no path is rooted at src/bench.rs when benches/bench.rs does not exist and src/bench.rs does (Cargo targets.rs, normalize_benches, legacy_bench_path), so its mod helpers; binds src/helpers/mod.rs, with the audit's probe p09 as a catalogue case (src/bench.rs:1 -> helpers), red before and green after · by: npm run check
- [test] From edition 2018, or when benches/bench.rs exists, src/bench.rs stays a module of the library, with a case · by: npm run check

## Changelog
- In edition 2015, a `[[bench]]` named `bench` without a `path` is rooted at `src/bench.rs` when `benches/bench.rs` is missing, as Cargo does, so its `mod helpers;` binds the module beside it.

## Evidence

### Proof

- **ran (line 319a52e87326):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; the cases were red at 725f2ae (rust-edition-2015-legacy-bench-path-edge, p09, failed: got none) and green after cbc0ebd
- **ran (line 90f3d39be494):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap) · **saw:** 2172 tests, 2171 pass, 0 fail, dist/ is fresh; rust-edition-2015-bench-file-exists-src-bench-module-edge and rust-edition-2018-src-bench-module-edge pass at cbc0ebd, and the unit test covers the two-files and other-name forms
- **ran (line 319a52e87326):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; over the base code rust-edition-2015-legacy-bench-path-edge fails
- **ran (line 90f3d39be494):** nice -n 15 npm run check (tip 942eb41, in the worktree, under a 12G cap); the branch's Rust tests also run over the code of release/1.1.0 · **saw:** 2172 tests, 2171 pass, 0 fail, 1 skipped, dist/ is fresh; the two guard cases pass, before and after

### Notes

Assumed: Cargo's legacy bench path is applied when benches/bench.rs and benches/bench/main.rs are not exactly one existing file, as the bin rule does, and only for edition 2015 and a bench named bench with no path.

