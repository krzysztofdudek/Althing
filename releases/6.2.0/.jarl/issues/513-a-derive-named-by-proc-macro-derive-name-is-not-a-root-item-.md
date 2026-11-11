# 513 · A derive named by #[proc_macro_derive(Name)] is not a root item of its proc-macro crate

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-nkns
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts, Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-derivenm
**Where:** src/relations/resolve-path.mts:839

## What
Claim: A path into a dependency binds its root file only when rustFileDeclares finds the name. A derive macro's name lives only in #[proc_macro_derive(Name)] on a function with another name, so `use derive_kit::Builder;` stays silent and the edge to the proc-macro crate is lost.

p38: silence; the dependency's root has `#[proc_macro_derive(Builder)] pub fn builder(…)`, and Rust resolves `derive_kit::Builder` to that derive in the dependency's root. Rust Reference, Procedural macros, Derive macros. Same at v1.0.0.

## Why


## Acceptance
- [test] The first argument of #[proc_macro_derive(Name, …)] on a function at the top level of a crate root is a root item called Name, so use derive_kit::Builder binds the proc-macro crate's root (Rust Reference, Procedural macros, Derive macros), with the audit's probe p38 as a catalogue case (app/src/lib.rs:1 -> macros), red before and green after · by: npm run check
- [test] A facade crate's pub use x_derive::Builder binds the proc-macro crate, and a use of Builder through the facade binds the facade's root, with a case · by: npm run check
- [test] The helper attribute names listed in attributes(…) are no root items, with a case · by: npm run check

## Evidence

