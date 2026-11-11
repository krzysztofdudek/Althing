# 634 · Runes docs/api.md, the paragraph on Rust crate-root items, asks a consumer that compacts its table …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1834-lmmd
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-604-opus
**Where:** the review of 604

## What
Runes docs/api.md, the paragraph on Rust crate-root items, asks a consumer that compacts its table to keep 'every key the extractor declares for every crate-root file', while the resolver asks a root only for item:<name>, extern:<name>, extern:<name>=<crate>, modfile:<path> and modfile?:<path> (src/relations/resolve-path.mts, declared()). Grain's compactDecls (issue 604) keeps exactly those kinds whole and a root's plain names compacted, which gives the full table's edges today. Name the Rust kinds in the docs as the C# base-classes paragraph names its records, so the contract matches what a compacting consumer keeps and a later reading of a root's plain names becomes a documented change.

## Why


## Acceptance


## Evidence

