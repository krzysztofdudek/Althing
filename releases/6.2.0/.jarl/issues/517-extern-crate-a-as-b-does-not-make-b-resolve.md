# 517 · extern crate a as b; does not make b resolve

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-tvdv
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts, Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-externas
**Where:** src/relations/extractors/rust.mts:352
**Branch:** jarl/523-rust-roots
**Worker:** w-523-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 13:54

## What
Claim: The extractor emits `extern crate a as b;` as the crate a and drops the alias, and the resolver knows no alias. A later `use b::X;` stays silent, in edition 2015 (b is a root item) and from 2018 on (b is in the extern prelude).

p16 (2015) and p17 (2021): src/api/client.rs:1 `use core2::Engine;` gives no edge, where the root has `extern crate engine_core as core2;`; Rust binds the dependency engine-core. Rust Reference, Extern crate declarations and Preludes, Extern prelude. Same at v1.0.0.

## Why


## Acceptance
- [test] extern crate a as b; at the crate root makes b name the path dependency a in every module of that crate, in edition 2015 and from 2018 on (Rust Reference, Extern crate declarations; Preludes, Extern prelude), with the sceptic's probes s15 (src/api/c.rs:1 -> dep) and s17 (src/api/client.rs:1 -> dep) as catalogue cases (the audit's p16 and p17 do not compile as written), red before and green after · by: npm run check
- [test] extern crate a as b; in a module other than the root binds b in that module only, with a case · by: npm run check

## Changelog
- `extern crate engine_core as core2;` in a crate root makes `use core2::Engine;` bind the in-repo path dependency in every module of that crate, in every edition; written in another module it does so in that module, from edition 2018 on. A graph may show new refusals for modules that reach a dependency only through such an alias.

## Evidence

### Proof

- **ran (line 3aee7a6cb9ae):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (release/1.1.0 at 28e52cf, the new cases added, before the fix) · **saw:** red: rust-edition-2015-root-extern-crate-alias-edge fails with 'expected edge src/api/c.rs:1->dep not emitted'; rust-root-extern-crate-alias-edge fails with 'expected edge src/api/client.rs:1->dep not emitted'
- **ran (line 13e03eb9892a):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (release/1.1.0 at 28e52cf, the new cases added, before the fix) · **saw:** red: rust-module-extern-crate-alias-own-module-only-edge fails with 'expected edge src/api/mod.rs:2->dep not emitted'
- **ran (line 3aee7a6cb9ae):** nice -n 15 npm run check (branch tip 096fd7c, clean tree) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh; rust-edition-2015-root-extern-crate-alias-edge and rust-root-extern-crate-alias-edge pass
- **ran (line 13e03eb9892a):** nice -n 15 npm run check (branch tip 096fd7c, clean tree) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh; rust-module-extern-crate-alias-own-module-only-edge passes

### Notes

Assumed: an alias written in a module that is not the crate root binds in that module's file from edition 2018 on, and nowhere in edition 2015, where a use path starts at the crate root. The binding is kept per file: a use inside an inline module of the same file is read as the file's own.

