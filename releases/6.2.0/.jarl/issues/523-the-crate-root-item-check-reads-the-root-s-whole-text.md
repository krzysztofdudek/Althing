# 523 · The crate:: root-item check reads the root's whole text

**Status:** in-progress
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
**Branch:** jarl/523-rust-roots
**Worker:** w-523-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 13:54

## What
Claim: For crate:: paths rootDeclares uses rustFileDeclares, a regular expression over the root's text with comments stripped. A name in a string literal or a function nested in another function counts as a root item, so a #[macro_export] macro defined elsewhere is pinned on the root file.

p43: src/api/mod.rs:1 -> node:root for `use crate::ensure;`, where the root mentions `fn ensure` in a string and in a nested fn and the macro lives in src/macros/mod.rs; with src/lib.rs:2 -> node:api the false edge closes a cycle. Control p42 without those mentions is silent. Same at v1.0.0.

## Why


## Acceptance
- [test] A crate:: path binds the root file only when the root's top level, read from its parse tree, binds the first segment as an item (an item it defines, a name a top-level use brings in, an item a known item macro defines), never a name in a string, a comment or a function nested in another, in every edition, with the audit's probe p43 as a catalogue case (no src/api/mod.rs:1 -> root), red before and green after · by: npm run check
- [test] The root items that bind today through a top-level item or use keep binding, p42 and p49 among them · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- A `crate::` path, or a path into an in-repo path dependency, binds the crate-root file only when the top level of that file binds the name: `use crate::ensure;` for a `#[macro_export]` macro defined in another module no longer gives an edge to the root because the root has `fn ensure` in a string or nested in another function. An item of `lazy_static!`, `thread_local!`, `bitflags!` or `cfg_if!` in the root (`static ref REGISTRY`) now binds it; a name that only another macro defines there gives no edge.

## Reviews
- **changes** · by rev-523-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1519-wnyw
  Every line is met by its test: 11 new cases red on release/1.1.0 at 28e52cf, green at 096fd7c (npm run check 2335 tests, 2334 pass, 1 skipped, dist/ identical to a rebuild); corpus gate passed, no golden line moved; of the audit's 53 Rust probes only p15, p16, p17, p38 and p43 move, each as asked, p42 and p49 unchanged. Rev 5 to 9 is honest: each of the four commits changes declarations() output and bumps once. Guard attacked on the built tool with 15 crate roots for `use crate::ensure;`: raw string, doc comment, #[doc] attribute, impl method, const block, macro_rules body, trait item, unknown macro, fn nested in a static initializer stay silent; extern block, use alias, cfg fn, r#ensure, fn after a broken fn, lazy_static item bind. Assumptions: no table keeps the 1.0 text reading (holds); a root extern crate name still binds the root for crate:: and facade paths (holds, as 1.0); the four resolver rows (the input cannot compile, the tree rule binds the binary; no guard weakened); the eight cases given edition 2021 are about manifest tables, pass at base too, and rustc 1.99.1 rejects their use in 2015 (E0432); per-file alias facts (Minor 4); unknown macros lose edges only. Not re-run: coverage. Findings, compared against rustc 1.99.1 in a rust:1-slim container. Important 1 · src/relations/resolve-path.mts:83 and docs/api.md:86: crate:: root items and the root items of a dependency are now read only from the table (base read the root's text). Grain's check path (arch.mjs computeArchHits: hydrateTable(compactDecls(...)) into makeResolver, named in plan-runes) keeps per key only the first file of each of the first two directories, and every module that writes `use core_lib::Engine;` declares item:Engine itself, so the root rarely survives. With Grain's compactDecls copied verbatim: `use core_lib::Engine;` against a root `pub use engine::Engine;` binds core-lib/src/lib.rs at base and silences at the tip; so do crate::Error re-exported by the root, crate::Config in three crates, and edition 2015 util::slug through the roots' extern crate. The full table gives the edge on both. docs/api.md says both consumers need no change; grain check would lose Rust edges into crate roots once it vendors 1.1.0. Needs a decision: the requirement stated in docs/api.md and Grain keeping the Rust per-file keys whole before 6.2.0 ships, or another reading. Minor 2 · src/relations/extractors/rust-resolve.mts:156: the per-file externcrate exemption lets a use path bind the dependency in a file that writes an aliased or nested extern crate of it: root `extern crate util as u; mod util; use util::slug;`, a module with `extern crate util as u; use util::slug;`, or `extern crate util;` in a fn body; rustc names the local module in all three, the tip binds util/src/lib.rs (as base did), against 516 line 1. Minor 3 · rust-resolve.mts:141-147: in edition 2015 the extern crate names of every root are asked before the items of the root that compiles the file: lib.rs `extern crate util;`, main.rs `mod util; mod cli;`, cli.rs `use util::slug;` binds the dependency where rustc names main's module. Minor 4 · rust-resolve.mts:142 with the per-file keys of rust.mts topLevelExternCrates: `extern crate engine_core as core2;` atop src/api.rs and `pub mod inner { pub mod core2 { … } use core2::Engine; }` gives a new false edge src/api.rs:5 -> engine-core/src/lib.rs (base silent); rustc names inner::core2. Minor 5 · src/relations/extractors/rust.mts:548: inside its proc-macro crate the derive function's own name is still a root item: `use crate::builder;` in src/helper.rs compiles, base binds src/lib.rs, the tip is silent (lost edge only). Minor 6 · rust-resolve.mts:156: Yggdrasil declares only mapped files, so in an edition 2015 crate whose root is mapped to no node every path-dependency import of its modules is now silent (bound before); docs/api.md says it only for root items. Minor 7 · docs/api.md:86: the two "Called without the table" sentences read as contradicting each other (2015 dependency paths bind as from 2018, then an edition 2015 use path stays silent).
  outside the issue, filed as 604: Grain's check-time symbol table (relations.mjs compactDecls, hydrated in arch.mjs computeArchHits) keeps per key only the first file of each of the first two directories, but Runes asks the Rust keys per file (item:, modfile:, extern:, externcrate:): on release/1.1.0 already the edition 2015 crate-root items and the module chains of several roots, and with issues 513, 516, 517 and 523 every crate-root item path, every root item of a dependency and every edition 2015 dependency import. grain check then misses Rust edges the full pass finds; the Rust per-file keys need to survive the compaction.

## Evidence

### Proof

- **ran (line 954d2e1b9840):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (release/1.1.0 at 28e52cf, the new cases added, before the fix) · **saw:** red: rust-crate-path-root-name-in-string-or-nested-fn-silence fails with 'unexpected cross-owner edge src/api/mod.rs:1->src'; rust-path-dependency-root-name-in-string-silence fails with 'unexpected cross-owner edge app/src/lib.rs:1->kitroot'; rust-crate-path-root-item-of-known-macro-edge fails: the lazy_static item gives no edge and the unknown macro's name gives one
- **ran (line 954d2e1b9840):** nice -n 15 npm run check (branch tip 096fd7c, clean tree) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh; the cases rust-crate-path-root-name-in-string-or-nested-fn-silence, rust-crate-path-root-name-in-comment-silence, rust-path-dependency-root-name-in-string-silence and rust-crate-path-root-item-of-known-macro-edge pass
- **ran (line 3464e3ed1593):** nice -n 15 npm run check (branch tip 096fd7c, clean tree) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; dist/ is fresh; the cases that bind a root through a top-level item, a use or an extern crate pass unchanged (rust-use-crate-root-item-edge, rust-pub-use-reexport-edge, rust-reexported-extern-crate-edge, rust-macro-export-silence, rust-edition-2015-use-crate-root-item-edge), and the control case rust-crate-path-root-name-in-comment-silence passed before and after
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> nice -n 15 npm run corpus (the tree of 79d93f1) · **saw:** corpus gate: passed; 25 repositories, every line '0 added, 0 removed, 0 explained' (ripgrep 372 edges, cargo 12 checked, 0 disagreements); 3 oracles skipped for a missing toolchain (go twice, dotnet). No golden line moved, so nothing to explain.
- **ran (line 954d2e1b9840, 3464e3ed1593):** systemd-run --user --scope -p MemoryMax=8G nice -n 15 node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (git archive of release/1.1.0 at 28e52cf, with the branch's reference/relations/rust cases, matrix and catalogue count copied in) · **saw:** red: rust-crate-path-root-name-in-string-or-nested-fn-silence, rust-path-dependency-root-name-in-string-silence and rust-crate-path-root-item-of-known-macro-edge fail; the comment control passes before as after
- **ran (line 954d2e1b9840, 3464e3ed1593):** systemd-run --user --scope -p MemoryMax=8G nice -n 15 npm run check (git archive of 096fd7c, npm ci; check:dist replaced by a diff of the rebuilt dist/ against the committed one, the extraction has no .git) · **saw:** green: tests 2335, pass 2334, fail 0, skipped 1; the rebuilt dist/ is identical to the committed dist/; the four root cases pass
- **ran (line 954d2e1b9840, 3464e3ed1593):** the 53 Rust probes of research 2026-11-03-runes-csharp-and-cargo-remaining-gaps through the catalogue runner, at 28e52cf and at 096fd7c · **saw:** only p15, p16, p17, p38 and p43 move, each as its issue asks; p42 and p49 give the same edges
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> systemd-run --user --scope -p MemoryMax=8G nice -n 15 npm run corpus (git archive of 096fd7c, which holds 79d93f1) · **saw:** corpus gate: passed; 25 repositories, every line 0 added, 0 removed, 0 explained; no golden line moved
- **ran (line 954d2e1b9840):** nice -n 15 npm run check (round 1 fixes, branch tip 14c0e80, clean tree) · **saw:** green: tests 2375, pass 2374, fail 0, skipped 1; dist/ is fresh; the four cases of line 1 pass
- **ran (line 3464e3ed1593):** nice -n 15 npm run check (round 1 fixes, branch tip 14c0e80, clean tree) · **saw:** green: tests 2375, pass 2374, fail 0, skipped 1; dist/ is fresh; the cases that bind a root through a top-level item, a use or an extern crate pass unchanged
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> nice -n 15 npm run corpus (round 1 fixes, branch tip 14c0e80) · **saw:** corpus gate: passed; no line with an added or removed edge (ripgrep 372 edges, cargo 12 checked, 0 disagreements); 3 oracles skipped for a missing toolchain (go twice, dotnet). No golden line moved, so nothing to explain.

### Notes

Assumed: a name the root's top level binds with extern crate (pub extern crate inner as name; in a facade) keeps binding the root file for a crate:: path and a path into a dependency, as the catalogue case rust-reexported-extern-crate-edge asks; it is read from the tree under a new key, and stays no item for an edition 2015 use path.

Assumed: a caller that passes no symbol table to the function makeResolvePathToFile returns has no parse tree, so it keeps the text reading of 1.0 (docs/api.md says so). Both consumers pass the table through makeResolver, so the pass reads the tree only.

Assumed: four rows of the resolver test 'takes a root for certain only from a plain mod item' expected the library to bind Opts when an unterminated string, character or comment had swallowed its struct Opts. That expectation was the text reading itself; the rows now expect the binary, the next root in the usual order. A name only an unknown macro defines no longer binds the root (the acceptance lists known item macros only).

Assumed: ruling rust-roots-need-the-whole-table is read as about a table that lacks keys. A caller that passes no table at all still gets the 1.0 text reading, which the examiner's round did not object to; docs/api.md states both in one place. A README behaviour paragraph is not affected.

