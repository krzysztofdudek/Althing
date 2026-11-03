# 521 · mod declarations inside cfg_if! are lost

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-cfgifmod
**Where:** src/relations/extractors/rust.mts:338

## What
Claim: A file-backed `mod x;` inside a cfg_if! branch is a token tree to the parser, so it emits nothing, though Runes already reads cfg_if! branches for root item names.

p23: silence; Rust declares src/unix/mod.rs or src/other/mod.rs from src/lib.rs:3 and :5. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Read `mod name;` tokens in each braced cfg_if! branch (as cfgIfItems does for names) and emit each as self::name; every branch is a real module on some target.

## Evidence

