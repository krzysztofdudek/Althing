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

### Notes

Assumed: a name the root's top level binds with extern crate (pub extern crate inner as name; in a facade) keeps binding the root file for a crate:: path and a path into a dependency, as the catalogue case rust-reexported-extern-crate-edge asks; it is read from the tree under a new key, and stays no item for an edition 2015 use path.

Assumed: a caller that passes no symbol table to the function makeResolvePathToFile returns has no parse tree, so it keeps the text reading of 1.0 (docs/api.md says so). Both consumers pass the table through makeResolver, so the pass reads the tree only.

Assumed: four rows of the resolver test 'takes a root for certain only from a plain mod item' expected the library to bind Opts when an unterminated string, character or comment had swallowed its struct Opts. That expectation was the text reading itself; the rows now expect the binary, the next root in the usual order. A name only an unknown macro defines no longer binds the root (the acceptance lists known item macros only).

