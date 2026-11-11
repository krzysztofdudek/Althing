# 514 · A path through a root glob re-export stays silent, across crates too

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-qytd
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/resolve-path.mts, Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-globroot
**Where:** src/relations/extractors/rust-resolve.mts:280
**After:** 523
**Branch:** jarl/514-rust-paths
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

## What
Claim: A root item lookup succeeds only when the root names the item; `pub use types::*;` names none, so a path to a glob-re-exported item binds nothing. Across crates this loses the only edge between the importing crate and its path dependency.

p50: app/src/lib.rs:1 `use kit::Order;` gives no edge, where kit's root is `mod types; pub use types::*;`; Rust resolves it to kit's types::Order, re-exported by the root. p41: the same in one crate for `use crate::Order;`. Rust Reference, Use declarations, Glob imports. Same at v1.0.0.

## Why


## Acceptance
- [test] A path to an item that a crate root brings in through a top-level glob re-export (pub use m::*;) binds the root file, as a named re-export of the item does, when the glob's module declares the item (Rust Reference, Use declarations, Glob imports), across a path dependency with the audit's probe p50 as a catalogue case (app/src/lib.rs:1 -> kitroot), red before and green after · by: npm run check
- [test] The same in one crate, with p41 as a catalogue case whose expectation gains src/api/mod.rs:1 -> root, red before and green after · by: npm run check
- [test] When the glob's module does not declare the name, or two top-level globs of the root both bring it in, the path gives no edge, with a case each · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- Fixed: Rust: a path to an item that a crate root re-exports through a glob (`mod types; pub use types::*;`, then `use kit::Order;` or `use crate::Order;`) binds the root file, as a named re-export does. A name two globs of the root both bring in, or one the glob's module does not declare, gives no edge. A graph can show new edges to crate roots.

## Evidence

### Proof

- **ran (line 72d9cecf05aa):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-path-dependency-root-glob-reexport-edge failed (app/src/lib.rs:1 -> kitroot not emitted); after: 191 tests, 0 fail
- **ran (line 72d9cecf05aa):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the case rust-path-dependency-root-glob-reexport-edge passes
- **ran (line 7a3b54dd6057):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-crate-root-glob-reexport-edge failed (src/api/mod.rs:1 -> root not emitted); after: 0 fail
- **ran (line 7a3b54dd6057):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the case rust-crate-root-glob-reexport-edge passes
- **ran (line e80cc0465541):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; rust-crate-root-glob-module-without-name-silence and rust-crate-root-two-globs-same-name-silence pass (both also silent before the fix: they hold the two limits); rustc 1.x refuses the two-glob fixture with E0659
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus · **saw:** corpus gate: passed; node scripts/corpus.mjs verify --tier all: passed after 109 added references (ripgrep 1, react 108), 0 removed, each explained in corpus/explained.md under Branch jarl/514-rust-paths; 36 of them are this issue's (imports of items react_compiler_hir re-exports with pub use reactive::*)

### Notes

Assumed: only a glob of a module in the root's own tree is followed, by its path from the root (bare, self:: or crate::). A glob of a module that itself re-exports through a glob, and a glob of another crate in a facade, are not followed and stay silent.

