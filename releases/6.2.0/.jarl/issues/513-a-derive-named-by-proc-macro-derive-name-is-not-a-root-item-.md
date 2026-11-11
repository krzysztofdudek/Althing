# 513 · A derive named by #[proc_macro_derive(Name)] is not a root item of its proc-macro crate

**Status:** in-progress
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
**Branch:** jarl/523-rust-roots
**Worker:** w-523-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 13:54

## What
Claim: A path into a dependency binds its root file only when rustFileDeclares finds the name. A derive macro's name lives only in #[proc_macro_derive(Name)] on a function with another name, so `use derive_kit::Builder;` stays silent and the edge to the proc-macro crate is lost.

p38: silence; the dependency's root has `#[proc_macro_derive(Builder)] pub fn builder(…)`, and Rust resolves `derive_kit::Builder` to that derive in the dependency's root. Rust Reference, Procedural macros, Derive macros. Same at v1.0.0.

## Why


## Acceptance
- [test] The first argument of #[proc_macro_derive(Name, …)] on a function at the top level of a crate root is a root item called Name, so use derive_kit::Builder binds the proc-macro crate's root (Rust Reference, Procedural macros, Derive macros), with the audit's probe p38 as a catalogue case (app/src/lib.rs:1 -> macros), red before and green after · by: npm run check
- [test] A facade crate's pub use x_derive::Builder binds the proc-macro crate, and a use of Builder through the facade binds the facade's root, with a case · by: npm run check
- [test] The helper attribute names listed in attributes(…) are no root items, with a case · by: npm run check

## Changelog
- A derive macro of an in-repo proc-macro crate gives its edge: `use derive_kit::Builder;` binds the crate whose root has `#[proc_macro_derive(Builder)]`, and so does a facade's `pub use kit_derive::Builder;`. The helper attributes in `attributes(…)` and the function behind the derive are no names to import. A graph may show new refusals where a crate derives through a proc-macro crate it does not declare.

## Evidence

### Proof

- **ran (line 6be782b16054):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (release/1.1.0 at 28e52cf, the new cases added, before the fix) · **saw:** red: rust-proc-macro-derive-name-edge fails with 'expected edge app/src/lib.rs:1->macros not emitted (got none)'
- **ran (line d4bc02a91331):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (release/1.1.0 at 28e52cf, the new cases added, before the fix) · **saw:** red: rust-proc-macro-derive-through-facade-edge fails with 'expected edge kit/src/lib.rs:1->macros not emitted (got app/src/lib.rs:1->facade)'
- **ran (line d7760df1093e):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (release/1.1.0 at 28e52cf, the new cases added, before the fix) · **saw:** red: rust-proc-macro-derive-helper-attribute-silence fails with 'unexpected cross-owner edge app/src/lib.rs:3->macros' (the function behind the derive was taken for an item)
- **ran (line 6be782b16054):** nice -n 15 npm run check (branch tip 096fd7c, clean tree) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh; rust-proc-macro-derive-name-edge passes
- **ran (line d4bc02a91331):** nice -n 15 npm run check (branch tip 096fd7c, clean tree) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh; rust-proc-macro-derive-through-facade-edge passes
- **ran (line d7760df1093e):** nice -n 15 npm run check (branch tip 096fd7c, clean tree) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh; rust-proc-macro-derive-helper-attribute-silence passes

### Notes

Assumed: a function with proc_macro_derive is declared as the derive's name in place of its own name, because a proc-macro crate exports only its macros; proc_macro and proc_macro_attribute functions keep their names. A proc_macro_derive applied through cfg_attr is not read.

