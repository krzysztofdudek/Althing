# 513 · A derive named by #[proc_macro_derive(Name)] is not a root item of its proc-macro crate

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-derivenm
**Where:** src/relations/resolve-path.mts:839

## What
Claim: A path into a dependency binds its root file only when rustFileDeclares finds the name. A derive macro's name lives only in #[proc_macro_derive(Name)] on a function with another name, so `use derive_kit::Builder;` stays silent and the edge to the proc-macro crate is lost.

p38: silence; the dependency's root has `#[proc_macro_derive(Builder)] pub fn builder(…)`, and Rust resolves `derive_kit::Builder` to that derive in the dependency's root. Rust Reference, Procedural macros, Derive macros. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Count the first argument of #[proc_macro_derive(Name, …)] as a root item name, both in rustFileDeclares and in topLevelItemNames.

## Evidence

