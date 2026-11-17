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

