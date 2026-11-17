# 28 · Runes, Rust catalogue: two cfg_if! cases that 700 made build on Linux and macOS do not build on Windows, so CI is red at d7ff132

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261117T1529-qhru
**Tags:** runes, rust, catalogue, ci
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** Runes CI run 44112364078, test-windows (22, 2) and (24, 2): rust-module-declared-in-cfg-if-and-stale-root-file-edge (E0432 unresolved import crate::unix) and rust-module-in-cfg-if-of-lib-root-item-edge (E0583 file not found for module other)
**Branch:** jarl/28-rust-cases-windows
**Worker:** w-700-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 15:29

## What
After 700 merged (d7ff132), the Rust build test on Windows fails for two cases whose module sits in a cfg_if! branch under #[cfg(unix)] (or another predicate false on Windows): rustc on Windows drops that branch, so the import of the module does not resolve and a mod's file is not found. Linux and macOS build them, which is why the local run and the review passed.

## Why
Runes ships only when CI is green on the exact commit tagged, on all three systems.

## Acceptance
[check] Runes CI on GitHub is green on Windows, Linux and macOS for the release branch tip that carries the fix, and each case keeps what its Rule tests (a module in a cfg_if! branch), with a predicate every target meets or with the case written so that each target builds it · by: the CI run of the pushed release/1.2.0 tip

## Evidence

### Proof

- **ran (line 334b84a37918):** at 659eca8, in a scratch clone with cargo and rustc 1.99.1 from rust:1.99.1-slim on PATH: node --test test/relations/rust-cases-build.test.mjs; then the same build test in two trees where cfg(unix) and cfg(windows) are swapped in every Rust case of the catalogue (a target that is not unix), one at 659eca8 and one at release/1.2.0 e1f7f23; then npm run check. Not the CI run on GitHub, which comes only after the jarl pushes · **saw:** build tests: tests 4, pass 4, fail 0, skipped 0. Swapped at e1f7f23: fail, exactly the two CI errors (rust-module-declared-in-cfg-if-and-stale-root-file-edge E0432 unresolved import crate::unix; rust-module-in-cfg-if-of-lib-root-item-edge E0583 file not found for module other). Swapped at 659eca8: every Rust case builds, pass 1, fail 0. npm run check: exit 0, tests 2835, pass 2834, fail 0, skipped 1 (the real-go oracle, go not installed), both cases pass their Expect, dist fresh. A grep of every cfg predicate in the 202 Rust cases finds only unix, windows, feature, any(), all() and macro-bound ones; the six OS-dependent cases have the files and imports of each branch

### Notes

At 659eca8: rust-module-declared-in-cfg-if-and-stale-root-file-edge imports crate::unix::f under #[cfg(unix)] on its line, so a target without the cfg_if! branch's unix module does not import it; rust-module-in-cfg-if-of-lib-root-item-edge gets src/other/mod.rs for its else branch's mod other, with that mod's edge in Expect. Emulated a target where unix does not hold by swapping cfg(unix) and cfg(windows) in the six Rust cases whose build depends on them: the old two cases fail exactly as CI did (E0432 crate::unix, E0583 other), the fixed ones and the other four build. Other predicates in the catalogue (feature, any(), all()) read the same on every target; macOS is unix, so it takes the branches Linux takes. Rust build tests under cargo and rustc 1.99.1 on Linux: tests 4, pass 4, fail 0, skipped 0; npm run check: tests 2835, pass 2832, fail 0, skipped 3, dist fresh.

