# 481 · Runes: in an edition 2015 package, a declared [[test]], [[example]] or [[bench]] also turns auto-discovery of its kind off

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 472
**Found by:** w-runes-472-sonnet
**Where:** The 472 worker's report (2026-11-03); The Cargo Book, Cargo Targets: for packages with the 2015 edition, the default for auto-discovery is false if at least one target is manually defined

## What
472 applies the 2015 rule to bins only. Applied to tests it changes the case rust-target-paths-shared-dir-silence (a [[test]] with tests/common/mod.rs), which needs deciding again.

## Why
Files Cargo does not build read as crate roots give false edges in old crates.

## Acceptance
The 2015 rule covers tests, examples and benches, with a case per kind red before and green after, and rust-target-paths-shared-dir-silence is decided again with its Rule saying why

## Evidence

