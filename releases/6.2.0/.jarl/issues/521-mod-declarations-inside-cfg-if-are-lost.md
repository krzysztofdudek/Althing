# 521 · mod declarations inside cfg_if! are lost

**Status:** in-progress
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
**Branch:** jarl/514-rust-paths
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

## What
Claim: A file-backed `mod x;` inside a cfg_if! branch is a token tree to the parser, so it emits nothing, though Runes already reads cfg_if! branches for root item names.

p23: silence; Rust declares src/unix/mod.rs or src/other/mod.rs from src/lib.rs:3 and :5. Same at v1.0.0.

## Why


## Acceptance
- [test] A file-backed mod declaration in any braced branch of a top-level cfg_if!, a nested cfg_if! included, gives the edge to that module's file, every branch being a module on some target, with the audit's probe p23 as a catalogue case (src/lib.rs:3 -> unix, src/lib.rs:5 -> other), red before and green after · by: npm run check
- [test] A mod with an inline body or with a #[path] attribute inside a cfg_if! branch follows the same rules as outside it, with a case · by: npm run check

## Changelog
- Fixed: Rust: a `mod x;` inside a branch of `cfg_if!` gives the edge to its file, in every branch, in a nested `cfg_if!` and inside an inline `mod` written there. A graph can show new edges from a platform layer to its modules.

## Evidence

### Proof

- **ran (line 2021171fc7db):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-mod-decl-inside-cfg-if-edge and rust-mod-decl-inside-cfg-if-nested-inline-and-path-edge failed (no edge); after: 0 fail
- **ran (line 2021171fc7db):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; both cases pass
- **ran (line a7693e9d2615):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; rust-mod-decl-inside-cfg-if-nested-inline-and-path-edge passes: the mod in an inline mod binds under its directory, the one with a path attribute gives no edge (red before the fix, as line 1)

### Notes

Assumed: a cfg_if! is read where it stands among the items of the file or of an inline module, not in a function body. Two existing cases with a mod in cfg_if! gained that mod's edge.

