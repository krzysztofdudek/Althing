# 518 · Edition 2018 uniform paths are lost

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-uniform1
**Where:** src/relations/extractors/rust-resolve.mts:139

## What
Claim: From edition 2018 a use path may start with a name in scope in the current module: a module it declares, or a name an earlier use bound. Runes treats every such bare first segment as an external crate.

p12: src/lib.rs `mod shapes; pub use shapes::Circle;` gives only line 1, line 2 is lost. p13: `use crate::shapes; use shapes::Circle;` gives only line 1. p50: kit/src/lib.rs:2 `pub use types::*;` is lost. Rust Reference, Use declarations (uniform paths). Same at v1.0.0. Most lost lines repeat an edge the same file already has, which keeps the severity low.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Resolve a bare first segment against the importing module's own `mod x;` declarations and its earlier `use` bindings before treating it as external; Rust rejects an ambiguity with a crate, so the binding is unique.

## Evidence

