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

## Reviews
- **changes** · by rev-523-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1519-wnyw
  Every line is met by its test: 11 new cases red on release/1.1.0 at 28e52cf, green at 096fd7c (npm run check 2335 tests, 2334 pass, 1 skipped, dist/ identical to a rebuild); corpus gate passed, no golden line moved; of the audit's 53 Rust probes only p15, p16, p17, p38 and p43 move, each as asked, p42 and p49 unchanged. Rev 5 to 9 is honest: each of the four commits changes declarations() output and bumps once. Guard attacked on the built tool with 15 crate roots for `use crate::ensure;`: raw string, doc comment, #[doc] attribute, impl method, const block, macro_rules body, trait item, unknown macro, fn nested in a static initializer stay silent; extern block, use alias, cfg fn, r#ensure, fn after a broken fn, lazy_static item bind. Assumptions: no table keeps the 1.0 text reading (holds); a root extern crate name still binds the root for crate:: and facade paths (holds, as 1.0); the four resolver rows (the input cannot compile, the tree rule binds the binary; no guard weakened); the eight cases given edition 2021 are about manifest tables, pass at base too, and rustc 1.99.1 rejects their use in 2015 (E0432); per-file alias facts (Minor 4); unknown macros lose edges only. Not re-run: coverage. Findings, compared against rustc 1.99.1 in a rust:1-slim container. Important 1 · src/relations/resolve-path.mts:83 and docs/api.md:86: crate:: root items and the root items of a dependency are now read only from the table (base read the root's text). Grain's check path (arch.mjs computeArchHits: hydrateTable(compactDecls(...)) into makeResolver, named in plan-runes) keeps per key only the first file of each of the first two directories, and every module that writes `use core_lib::Engine;` declares item:Engine itself, so the root rarely survives. With Grain's compactDecls copied verbatim: `use core_lib::Engine;` against a root `pub use engine::Engine;` binds core-lib/src/lib.rs at base and silences at the tip; so do crate::Error re-exported by the root, crate::Config in three crates, and edition 2015 util::slug through the roots' extern crate. The full table gives the edge on both. docs/api.md says both consumers need no change; grain check would lose Rust edges into crate roots once it vendors 1.1.0. Needs a decision: the requirement stated in docs/api.md and Grain keeping the Rust per-file keys whole before 6.2.0 ships, or another reading. Minor 2 · src/relations/extractors/rust-resolve.mts:156: the per-file externcrate exemption lets a use path bind the dependency in a file that writes an aliased or nested extern crate of it: root `extern crate util as u; mod util; use util::slug;`, a module with `extern crate util as u; use util::slug;`, or `extern crate util;` in a fn body; rustc names the local module in all three, the tip binds util/src/lib.rs (as base did), against 516 line 1. Minor 3 · rust-resolve.mts:141-147: in edition 2015 the extern crate names of every root are asked before the items of the root that compiles the file: lib.rs `extern crate util;`, main.rs `mod util; mod cli;`, cli.rs `use util::slug;` binds the dependency where rustc names main's module. Minor 4 · rust-resolve.mts:142 with the per-file keys of rust.mts topLevelExternCrates: `extern crate engine_core as core2;` atop src/api.rs and `pub mod inner { pub mod core2 { … } use core2::Engine; }` gives a new false edge src/api.rs:5 -> engine-core/src/lib.rs (base silent); rustc names inner::core2. Minor 5 · src/relations/extractors/rust.mts:548: inside its proc-macro crate the derive function's own name is still a root item: `use crate::builder;` in src/helper.rs compiles, base binds src/lib.rs, the tip is silent (lost edge only). Minor 6 · rust-resolve.mts:156: Yggdrasil declares only mapped files, so in an edition 2015 crate whose root is mapped to no node every path-dependency import of its modules is now silent (bound before); docs/api.md says it only for root items. Minor 7 · docs/api.md:86: the two "Called without the table" sentences read as contradicting each other (2015 dependency paths bind as from 2018, then an edition 2015 use path stays silent).
  outside the issue, filed as 604: Grain's check-time symbol table (relations.mjs compactDecls, hydrated in arch.mjs computeArchHits) keeps per key only the first file of each of the first two directories, but Runes asks the Rust keys per file (item:, modfile:, extern:, externcrate:): on release/1.1.0 already the edition 2015 crate-root items and the module chains of several roots, and with issues 513, 516, 517 and 523 every crate-root item path, every root item of a dependency and every edition 2015 dependency import. grain check then misses Rust edges the full pass finds; the Rust per-file keys need to survive the compaction.

## Evidence

### Proof

- **ran (line 3aee7a6cb9ae):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (release/1.1.0 at 28e52cf, the new cases added, before the fix) · **saw:** red: rust-edition-2015-root-extern-crate-alias-edge fails with 'expected edge src/api/c.rs:1->dep not emitted'; rust-root-extern-crate-alias-edge fails with 'expected edge src/api/client.rs:1->dep not emitted'
- **ran (line 13e03eb9892a):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (release/1.1.0 at 28e52cf, the new cases added, before the fix) · **saw:** red: rust-module-extern-crate-alias-own-module-only-edge fails with 'expected edge src/api/mod.rs:2->dep not emitted'
- **ran (line 3aee7a6cb9ae):** nice -n 15 npm run check (branch tip 096fd7c, clean tree) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh; rust-edition-2015-root-extern-crate-alias-edge and rust-root-extern-crate-alias-edge pass
- **ran (line 13e03eb9892a):** nice -n 15 npm run check (branch tip 096fd7c, clean tree) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh; rust-module-extern-crate-alias-own-module-only-edge passes
- **ran (line 3aee7a6cb9ae, 13e03eb9892a):** systemd-run --user --scope -p MemoryMax=8G nice -n 15 node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (git archive of release/1.1.0 at 28e52cf, with the branch's reference/relations/rust cases, matrix and catalogue count copied in) · **saw:** red: rust-edition-2015-root-extern-crate-alias-edge, rust-root-extern-crate-alias-edge and rust-module-extern-crate-alias-own-module-only-edge fail
- **ran (line 3aee7a6cb9ae, 13e03eb9892a):** systemd-run --user --scope -p MemoryMax=8G nice -n 15 npm run check (git archive of 096fd7c, npm ci; check:dist replaced by a diff of the rebuilt dist/ against the committed one, the extraction has no .git) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; the rebuilt dist/ is identical to the committed dist/; the three alias cases pass

### Notes

Assumed: an alias written in a module that is not the crate root binds in that module's file from edition 2018 on, and nowhere in edition 2015, where a use path starts at the crate root. The binding is kept per file: a use inside an inline module of the same file is read as the file's own.

