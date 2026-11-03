# 520 · A #[path] attribute followed by a doc comment is not seen

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-pathdocc
**Where:** src/relations/extractors/rust.mts:220

## What
Claim: modHasPathOverride walks back over attribute_item siblings only and stops at a comment, so `#[path = …]`, a doc comment, then `mod sys;` is resolved at the conventional location, which is no module of the crate.

p20: src/lib.rs:3 -> node:sys, a false edge to the decoy src/sys/mod.rs; Rust loads src/imp/unix.rs. Rust Reference, Modules, The path attribute. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Skip line_comment and block_comment siblings while looking for the item's attributes.

## Evidence

