# 618 · Runes: an extern crate alias binds only a use whose direct parent writes it (not a use in a function body or a nested block of that module), and edition 2015 reads the package's own crate name before the roots

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1611-uabh
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 523
**Found by:** jarl
**Where:** rev-523b-opus, the Rust roots package round 2 (rust.mts:352; rust-resolve.mts:173)

## What


## Why
rustc binds the alias in the whole module, so a use in a function body loses its edge; and in edition 2015 a package's own name never reaches its library without extern crate, so use parser::Marker binds the root where rustc names src/parser.rs.

## Acceptance
[test] A use in a function body or a nested block of a module that writes extern crate engine_core as core2; binds engine-core, and in edition 2015 a crate named parser whose root has pub mod parser; binds use parser::Marker to src/parser.rs, each a catalogue case checked against rustc, red before and green after · by: npm run check

## Evidence

