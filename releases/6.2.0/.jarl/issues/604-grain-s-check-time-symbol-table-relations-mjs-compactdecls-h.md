# 604 · Grain's check-time symbol table (relations.mjs compactDecls, hydrated in arch.mjs computeArchHits) …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1519-lcac
**Tags:** 
**Files:** Grain/plugins/grain/engine/relations.mjs Grain/plugins/grain/engine/arch.mjs
**Repo:** Grain
**Found by:** rev-523-opus
**Where:** the review of 513, 516, 517, 523
**Branch:** jarl/604-whole-keys
**Worker:** w-604-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 17:47

## What
Grain's check-time symbol table (relations.mjs compactDecls, hydrated in arch.mjs computeArchHits) keeps per key only the first file of each of the first two directories, but Runes asks the Rust keys per file (item:, modfile:, extern: and, from Runes rev 11, extern:: scoped keys): on release/1.1.0 already the edition 2015 crate-root items and the module chains of several roots, and with issues 513, 516, 517 and 523 every crate-root item path, every root item of a dependency and every edition 2015 dependency import. grain check then misses Rust edges the full pass finds; the Rust per-file keys need to survive the compaction. Since 493-498, C# base and member-type records are read with a per-file usings record shared by files with identical using directives; the same compaction drops 456 of 1 384 such records on jellyfin and the edit-time check gives an edge the full pass does not (ruling per-file-keys-are-kept-whole).

## Why


## Acceptance


[read] The model file's growth from keeping those keys is measured on jellyfin and a Rust corpus repository and stated in the CHANGELOG if it is noticeable

## Evidence

