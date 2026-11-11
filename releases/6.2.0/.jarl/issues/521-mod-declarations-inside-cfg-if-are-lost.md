# 521 · mod declarations inside cfg_if! are lost

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-mwhb
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-cfgifmod
**Where:** src/relations/extractors/rust.mts:338

## What
Claim: A file-backed `mod x;` inside a cfg_if! branch is a token tree to the parser, so it emits nothing, though Runes already reads cfg_if! branches for root item names.

p23: silence; Rust declares src/unix/mod.rs or src/other/mod.rs from src/lib.rs:3 and :5. Same at v1.0.0.

## Why


## Acceptance
- [test] A file-backed mod declaration in any braced branch of a top-level cfg_if!, a nested cfg_if! included, gives the edge to that module's file, every branch being a module on some target, with the audit's probe p23 as a catalogue case (src/lib.rs:3 -> unix, src/lib.rs:5 -> other), red before and green after · by: npm run check
- [test] A mod with an inline body or with a #[path] attribute inside a cfg_if! branch follows the same rules as outside it, with a case · by: npm run check

## Evidence

