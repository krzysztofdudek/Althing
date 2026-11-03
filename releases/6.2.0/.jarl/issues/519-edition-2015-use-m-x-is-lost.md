# 519 · Edition 2015 use ::m::X is lost

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-lead2015
**Where:** src/relations/extractors/rust.mts:109

## What
Claim: In edition 2015 a path that starts with :: is relative to the crate root. The extractor returns no specifier for a scoped identifier without a path prefix, so the path is dropped.

p14: silence for src/api/client.rs `use ::shapes::Circle;`, which Rust resolves to src/shapes/mod.rs (node shapes). Rust Reference, Paths, Path qualifiers. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Emit a leading-:: path as `crate::…` in a 2015 target and leave it external from 2018 on; the extractor can mark it and the resolver decide by edition.

## Evidence

