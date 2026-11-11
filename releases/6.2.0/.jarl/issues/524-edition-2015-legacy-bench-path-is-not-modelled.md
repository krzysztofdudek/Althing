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

## Evidence

