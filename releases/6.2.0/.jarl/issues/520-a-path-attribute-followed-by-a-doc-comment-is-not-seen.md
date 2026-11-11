# 520 · A #[path] attribute followed by a doc comment is not seen

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-zggh
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-pathdocc
**Where:** src/relations/extractors/rust.mts:220
**Branch:** jarl/514-rust-paths
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

## What
Claim: modHasPathOverride walks back over attribute_item siblings only and stops at a comment, so `#[path = …]`, a doc comment, then `mod sys;` is resolved at the conventional location, which is no module of the crate.

p20: src/lib.rs:3 -> node:sys, a false edge to the decoy src/sys/mod.rs; Rust loads src/imp/unix.rs. Rust Reference, Modules, The path attribute. Same at v1.0.0.

## Why


## Acceptance
[test] A #[path] attribute separated from its mod by doc comments, line or block comments, or other attributes is still read as that mod's path override (Rust Reference, Modules, The path attribute), so the conventional decoy src/sys/mod.rs gets no edge, with the audit's probe p20 as a catalogue case (silence), red before and green after · by: npm run check

## Evidence

