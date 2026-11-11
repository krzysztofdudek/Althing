# 514 · A path through a root glob re-export stays silent, across crates too

**Status:** done
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
**Merged:** e9509e1
**Merge check:** npm run check · saw tests 2523, pass 2522, fail 0, skipped 1; catalogue 893 equals the case files; dist fresh after the commit

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

## Reviews
- **approve** · by rev-514-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1914-jujh
  Approve at e762b68, Minor findings only. Re-ran: the full suite (2523 tests, 2522 pass, 0 fail, 1 skipped: go not installed), dist fresh, every new case red over release/1.1.0's code, the corpus gate and verify --tier all passed, and every fixture compiled with rustc 1.99.1 (decoys and stale files poisoned with compile_error!, never read). Rev 11 to 18 is one bump per output-changing commit; e762b68 changes no output (uses() and declarations() identical to 03bbf5f over 1001 Rust files). Catalogue 893 = case files = runCase calls. The 109 corpus lines are react's Rust compiler crates (72 for 518, 36 for 514's pub use reactive::*) and ripgrep's crates/index (518), each true in the source. All ten key kinds the extractor declares (mod:, mods:all, glob:, pathmod:, pathmod-name:, item:, extern:, modfile:, modfile?:) match Grain's per-file rule on release/6.2.0, names do not, and a Grain-style compacted table gives the same references as the full one on react and ripgrep. The three limit cases fail when the code is broken for them. 518 line 2: its text is false for rustc 1.99.1, which compiles a local mod shapes beside a dependency shapes with no ambiguity error and binds the local module; the case asserts that edge; the director should restate the line to the compiler's behaviour before merge (no code change). Minor 1, src/relations/resolve-path.mts:92: a name two cfg-exclusive root globs bring in (#[cfg(unix)] pub use unix::*; #[cfg(windows)] pub use windows::*;, both defining Order) gives no edge, and so does one item two globs reach (b re-exports a::Order); rustc compiles both and the edge is the root file either way: a lost edge, never a false one. Minor 2, src/relations/resolve-path.mts:76 and :102: each mods:all question copies the key's whole file list (filesFor(...).includes), and nearly every Rust file declares mods:all, so the check is linear in the Rust files; a synthetic package with stale files went 0.5 to 0.6 s at 2003 files, 1.4 to 3.1 s at 8003, 3.8 to 11.6 s at 16003 (quadratic); react shows no change. Minor 3, reference/relations/rust/rust-path-loaded-file-relative-path-forms-edge.md:21: the fixture does not compile as written: rustc does not collapse imp/.. without a src/imp/ directory, and the wrap mod's path names src/wrap/platform/tty.rs, which is missing; the tty expectation is Runes's rule for a file nothing loads, not a compiler fact. Noted: under the coverage run (99.15/95.70/99.19, above the thresholds) two timing tests of the Go and C# extractors failed on one throttled core; the plain suite passes them.

## Evidence

### Proof

- **ran (line 72d9cecf05aa):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-path-dependency-root-glob-reexport-edge failed (app/src/lib.rs:1 -> kitroot not emitted); after: 191 tests, 0 fail
- **ran (line 72d9cecf05aa):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the case rust-path-dependency-root-glob-reexport-edge passes
- **ran (line 7a3b54dd6057):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-crate-root-glob-reexport-edge failed (src/api/mod.rs:1 -> root not emitted); after: 0 fail
- **ran (line 7a3b54dd6057):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the case rust-crate-root-glob-reexport-edge passes
- **ran (line e80cc0465541):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; rust-crate-root-glob-module-without-name-silence and rust-crate-root-two-globs-same-name-silence pass (both also silent before the fix: they hold the two limits); rustc 1.x refuses the two-glob fixture with E0659
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus · **saw:** corpus gate: passed; node scripts/corpus.mjs verify --tier all: passed after 109 added references (ripgrep 1, react 108), 0 removed, each explained in corpus/explained.md under Branch jarl/514-rust-paths; 36 of them are this issue's (imports of items react_compiler_hir re-exports with pub use reactive::*)
- **ran (line 72d9cecf05aa):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check of the case's files in rust:1-slim (rustc 1.99.1) · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-path-dependency-root-glob-reexport-edge passes, and fails over release/1.1.0's code; rustc 1.99.1 compiles the fixture (use kit::Order through the root's pub use types::*)
- **ran (line 7a3b54dd6057):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check of the case's files in rust:1-slim (rustc 1.99.1) · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-crate-root-glob-reexport-edge passes (src/api/mod.rs:1 -> root) and fails over release/1.1.0's code; rustc 1.99.1 compiles it
- **ran (line e80cc0465541):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; the built resolve-path.mjs edited in a scratch copy two ways (two globs counted as one; any module declaring the name counted, glob or not); cargo check of both fixtures in rust:1-slim · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-crate-root-glob-module-without-name-silence and rust-crate-root-two-globs-same-name-silence pass (silent before the fix too); counting two globs as one turns the two-globs case red, counting any module turns the without-name case red, so both can fail for the right reason; rustc 1.99.1 refuses the two-globs use as ambiguous and the without-name use with E0432
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus; node scripts/corpus.mjs verify --tier all, in the extraction at e762b68; the 109 added golden lines read against the pinned sources · **saw:** corpus gate: passed (go and dotnet oracles skipped: not installed); corpus verify: passed, every repository 0 added 0 removed against the committed goldens; the branch adds 109 golden lines (react 108, ripgrep 1), removes none, each listed under Branch jarl/514-rust-paths in corpus/explained.md; the 36 into react_compiler_hir/src/lib.rs import items of reactive.rs that the root brings in with pub use reactive::*, checked in the source

### Notes

Assumed: only a glob of a module in the root's own tree is followed, by its path from the root (bare, self:: or crate::). A glob of a module that itself re-exports through a glob, and a glob of another crate in a facade, are not followed and stay silent.

