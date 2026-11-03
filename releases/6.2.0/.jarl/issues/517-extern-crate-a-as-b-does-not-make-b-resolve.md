# 517 · extern crate a as b; does not make b resolve

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-externas
**Where:** src/relations/extractors/rust.mts:352

## What
Claim: The extractor emits `extern crate a as b;` as the crate a and drops the alias, and the resolver knows no alias. A later `use b::X;` stays silent, in edition 2015 (b is a root item) and from 2018 on (b is in the extern prelude).

p16 (2015) and p17 (2021): src/api/client.rs:1 `use core2::Engine;` gives no edge, where the root has `extern crate engine_core as core2;`; Rust binds the dependency engine-core. Rust Reference, Extern crate declarations and Preludes, Extern prelude. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Record root-level `extern crate a as b;` aliases per crate and resolve a first segment b as the dependency a.

## Evidence

