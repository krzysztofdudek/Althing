# 524 · Edition 2015 legacy_bench_path is not modelled

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-benchleg
**Where:** src/relations/resolve-path.mts:262

## What
Claim: In edition 2015 Cargo roots a [[bench]] named bench with no path at src/bench.rs when no benches/bench.rs exists. Runes models the legacy paths of binaries only, so src/bench.rs is read as a module of the library and its `mod x;` is looked for under src/bench/.

p09: silence; Rust gives src/bench.rs:1 -> node:helpers (src/helpers/mod.rs). Cargo targets.rs normalize_benches, legacy_bench_path. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Add src/bench.rs as a target path for a 2015 [[bench]] named bench that gives no path and is not found under benches/.

## Evidence

