# 614 · Runes: a local mod inside an inline module does not shadow a root's extern crate alias of the same name

**Status:** open
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

## What


## Why
rustc resolves the name to the nearer module; Runes binds the aliased crate, a false edge to another package.

## Acceptance
[test] With extern crate engine_core as core2; in the root and mod inner { mod core2 {…} use core2::Engine; }, the use binds inner::core2, not engine-core, a catalogue case red before and green after · by: npm run check

## Evidence

