# 604 · Grain's check-time symbol table (relations.mjs compactDecls, hydrated in arch.mjs computeArchHits) …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1519-lcac
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-523-opus
**Where:** the review of 513, 516, 517, 523

## What
Grain's check-time symbol table (relations.mjs compactDecls, hydrated in arch.mjs computeArchHits) keeps per key only the first file of each of the first two directories, but Runes asks the Rust keys per file (item:, modfile:, extern:, externcrate:): on release/1.1.0 already the edition 2015 crate-root items and the module chains of several roots, and with issues 513, 516, 517 and 523 every crate-root item path, every root item of a dependency and every edition 2015 dependency import. grain check then misses Rust edges the full pass finds; the Rust per-file keys need to survive the compaction.

## Why


## Acceptance


## Evidence

