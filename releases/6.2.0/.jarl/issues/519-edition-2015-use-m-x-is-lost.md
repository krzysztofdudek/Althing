# 519 · Edition 2015 use ::m::X is lost

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-jaep
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts, Runes/src/relations/extractors/rust-resolve.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-lead2015
**Where:** src/relations/extractors/rust.mts:109
**Branch:** jarl/514-rust-paths
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

## What
Claim: In edition 2015 a path that starts with :: is relative to the crate root. The extractor returns no specifier for a scoped identifier without a path prefix, so the path is dropped.

p14: silence for src/api/client.rs `use ::shapes::Circle;`, which Rust resolves to src/shapes/mod.rs (node shapes). Rust Reference, Paths, Path qualifiers. Same at v1.0.0.

## Why


## Acceptance
- [test] In edition 2015 a use path that starts with :: is relative to the crate root (Rust Reference, Paths, Path qualifiers), so use ::shapes::Circle; binds the root's module, with the sceptic's probe s15 as a catalogue case (src/api/b.rs:1 -> shapes; the audit's p14 does not compile as written), red before and green after · by: npm run check
- [test] From edition 2018 a path that starts with :: names a crate only: it never binds a module of the crate, and it binds a path dependency of that name, with a case · by: npm run check

## Evidence

