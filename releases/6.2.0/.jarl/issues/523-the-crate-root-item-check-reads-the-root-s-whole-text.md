# 523 · The crate:: root-item check reads the root's whole text

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-textdecl
**Where:** src/relations/resolve-path.mts:377

## What
Claim: For crate:: paths rootDeclares uses rustFileDeclares, a regular expression over the root's text with comments stripped. A name in a string literal or a function nested in another function counts as a root item, so a #[macro_export] macro defined elsewhere is pinned on the root file.

p43: src/api/mod.rs:1 -> node:root for `use crate::ensure;`, where the root mentions `fn ensure` in a string and in a nested fn and the macro lives in src/macros/mod.rs; with src/lib.rs:2 -> node:api the false edge closes a cycle. Control p42 without those mentions is silent. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Use the parse-tree top-level item names (rustTopLevelItemKey, already declared for edition 2015) for crate:: root items in every edition, plus `extern crate` aliases.

## Evidence

