# 614 · Runes: a local mod inside an inline module does not shadow a root's extern crate alias of the same name

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1556-lixq
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 523
**Found by:** jarl
**Where:** w-523-fable, the Rust roots package round 1
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why
rustc resolves the name to the nearer module; Runes binds the aliased crate, a false edge to another package.

## Acceptance
[test] With extern crate engine_core as core2; in the root and mod inner { mod core2 {…} use core2::Engine; }, the use binds inner::core2, not engine-core, a catalogue case red before and green after · by: npm run check

## Evidence

### Notes

Fault does not hold on release/1.1.0 (e9509e1): with extern crate engine_core as core2; in src/lib.rs, a use core2::X inside mod inner { mod core2 {...} } (beside it and in a function body), in a file module that declares mod core2; and in an inline module of it, binds the local module or its own file and never engine-core, on release/1.1.0 and on this branch alike; each shape compiles under rustc 1.99.1. Likely fixed when 518 carried the scopes down the walk. Nothing changed for 614.

