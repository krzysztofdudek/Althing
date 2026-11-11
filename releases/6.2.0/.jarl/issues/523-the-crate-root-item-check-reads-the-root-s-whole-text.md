# 523 · The crate:: root-item check reads the root's whole text

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-jcyb
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/resolve-path.mts, Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-textdecl
**Where:** src/relations/resolve-path.mts:377

## What
Claim: For crate:: paths rootDeclares uses rustFileDeclares, a regular expression over the root's text with comments stripped. A name in a string literal or a function nested in another function counts as a root item, so a #[macro_export] macro defined elsewhere is pinned on the root file.

p43: src/api/mod.rs:1 -> node:root for `use crate::ensure;`, where the root mentions `fn ensure` in a string and in a nested fn and the macro lives in src/macros/mod.rs; with src/lib.rs:2 -> node:api the false edge closes a cycle. Control p42 without those mentions is silent. Same at v1.0.0.

## Why


## Acceptance
- [test] A crate:: path binds the root file only when the root's top level, read from its parse tree, binds the first segment as an item (an item it defines, a name a top-level use brings in, an item a known item macro defines), never a name in a string, a comment or a function nested in another, in every edition, with the audit's probe p43 as a catalogue case (no src/api/mod.rs:1 -> root), red before and green after · by: npm run check
- [test] The root items that bind today through a top-level item or use keep binding, p42 and p49 among them · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

