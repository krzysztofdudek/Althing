# 518 · Edition 2018 uniform paths are lost

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-ukah
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-uniform1
**Where:** src/relations/extractors/rust-resolve.mts:139
**Branch:** jarl/514-rust-paths
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

## What
Claim: From edition 2018 a use path may start with a name in scope in the current module: a module it declares, or a name an earlier use bound. Runes treats every such bare first segment as an external crate.

p12: src/lib.rs `mod shapes; pub use shapes::Circle;` gives only line 1, line 2 is lost. p13: `use crate::shapes; use shapes::Circle;` gives only line 1. p50: kit/src/lib.rs:2 `pub use types::*;` is lost. Rust Reference, Use declarations (uniform paths). Same at v1.0.0. Most lost lines repeat an edge the same file already has, which keeps the severity low.

## Why


## Acceptance
- [test] From edition 2018, the first segment of a use path that names a module the importing module declares (mod shapes; pub use shapes::Circle;) or a name an earlier use of that module brought in (use crate::shapes; use shapes::Circle;) resolves in the crate (Rust Reference, Use declarations, uniform paths), with the audit's probe p12 (src/lib.rs:2 -> shapes), the sceptic's probe s13 (src/api/client.rs:2 -> shapes, src/api/other.rs:2 -> round) and p50 (kit/src/lib.rs:2 -> types) as catalogue cases, red before and green after · by: npm run check
- [test] A first segment that names both such a local name and a crate (an error in Rust) gives no edge, and a first segment that names only a crate keeps binding that crate, with a case each · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- Fixed: Rust: from edition 2018 a `use` path that starts with a name in scope is followed: a module the same module declares (`mod shapes; pub use shapes::Circle;`) or a name another `use` there brought in (`use crate::shapes; use shapes::round::Arc;`). A local name is found before a crate of the same name. The extractor emits such a path in a new form, so stored hints are stale by its `rev`. A graph can show new edges.

## Reviews
- **approve** · by rev-514-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1914-jujh
  Approve at e762b68, Minor findings only. Re-ran: the full suite (2523 tests, 2522 pass, 0 fail, 1 skipped: go not installed), dist fresh, every new case red over release/1.1.0's code, the corpus gate and verify --tier all passed, and every fixture compiled with rustc 1.99.1 (decoys and stale files poisoned with compile_error!, never read). Rev 11 to 18 is one bump per output-changing commit; e762b68 changes no output (uses() and declarations() identical to 03bbf5f over 1001 Rust files). Catalogue 893 = case files = runCase calls. The 109 corpus lines are react's Rust compiler crates (72 for 518, 36 for 514's pub use reactive::*) and ripgrep's crates/index (518), each true in the source. All ten key kinds the extractor declares (mod:, mods:all, glob:, pathmod:, pathmod-name:, item:, extern:, modfile:, modfile?:) match Grain's per-file rule on release/6.2.0, names do not, and a Grain-style compacted table gives the same references as the full one on react and ripgrep. The three limit cases fail when the code is broken for them. 518 line 2: its text is false for rustc 1.99.1, which compiles a local mod shapes beside a dependency shapes with no ambiguity error and binds the local module; the case asserts that edge; the director should restate the line to the compiler's behaviour before merge (no code change). Minor 1, src/relations/resolve-path.mts:92: a name two cfg-exclusive root globs bring in (#[cfg(unix)] pub use unix::*; #[cfg(windows)] pub use windows::*;, both defining Order) gives no edge, and so does one item two globs reach (b re-exports a::Order); rustc compiles both and the edge is the root file either way: a lost edge, never a false one. Minor 2, src/relations/resolve-path.mts:76 and :102: each mods:all question copies the key's whole file list (filesFor(...).includes), and nearly every Rust file declares mods:all, so the check is linear in the Rust files; a synthetic package with stale files went 0.5 to 0.6 s at 2003 files, 1.4 to 3.1 s at 8003, 3.8 to 11.6 s at 16003 (quadratic); react shows no change. Minor 3, reference/relations/rust/rust-path-loaded-file-relative-path-forms-edge.md:21: the fixture does not compile as written: rustc does not collapse imp/.. without a src/imp/ directory, and the wrap mod's path names src/wrap/platform/tty.rs, which is missing; the tty expectation is Runes's rule for a file nothing loads, not a compiler fact. Noted: under the coverage run (99.15/95.70/99.19, above the thresholds) two timing tests of the Go and C# extractors failed on one throttled core; the plain suite passes them.

## Evidence

### Proof

- **ran (line 668b17b1b944):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-edition-2018-use-local-module-edge, rust-edition-2018-use-imported-module-edge, rust-edition-2018-use-imported-module-in-function-body-edge and rust-path-dependency-root-glob-reexport-edge failed; after: 0 fail
- **ran (line 668b17b1b944):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the four cases pass
- **ran (line c653aecbfb04):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-edition-2018-use-local-module-over-crate-edge failed; after: it passes, and rust-edition-2018-use-crate-not-local-name-edge passes before and after
- **ran (line c653aecbfb04):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; both cases pass. The first asserts the edge to the local module, not silence: rustc 1.x compiles the fixture and binds the local name (see the note)
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus · **saw:** corpus gate: passed; verify --tier all passed; 73 of the 109 added references are this issue's (use paths that start with a module their own file declares), 0 removed
- **ran (line 668b17b1b944):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check of the case files in rust:1-slim (rustc 1.99.1) · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-edition-2018-use-local-module-edge, rust-edition-2018-use-imported-module-edge, rust-edition-2018-use-imported-module-in-function-body-edge and rust-path-dependency-root-glob-reexport-edge pass and fail over release/1.1.0's code; rustc 1.99.1 compiles p12, s13 and p50 (the in-function-body case is refused only on its line 7, the use the case holds silent)
- **ran (line c653aecbfb04):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check in rust:1-slim (rustc 1.99.1) of rust-edition-2018-use-local-module-over-crate-edge, and of a copy where the dependency shapes also defines Square and only the local Square has an associated const LOCAL that lib.rs reads; the extractor edited in a scratch copy to read every bare first segment as a local module · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; the case asserts the edge to the local module, not silence, and fails over release/1.1.0's code; rustc 1.99.1 compiles both fixtures without an ambiguity error and Square::LOCAL resolves: the local module is found before the crate, so the line's 'an error in Rust ... gives no edge' does not hold for rustc 1.99.1, and the case follows the compiler; rust-edition-2018-use-crate-not-local-name-edge passes before and after, and reading every bare segment as local turns it red
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus; node scripts/corpus.mjs verify --tier all, in the extraction at e762b68 · **saw:** corpus gate: passed; corpus verify: passed; 73 of the 109 added lines are this issue's (react 72: pub use x::y after mod x in the same file; ripgrep 1: crates/index/src/lib.rs:3 pub use index::{...} with mod index), each explained, 0 removed

### Notes

Assumed: acceptance line 2 says a first segment that names both a local name and a crate is an error in Rust and gives no edge. rustc 1.x (rust:1-slim, editions 2018 and 2021) compiles it and binds the local name: with a path dependency shapes and a local mod shapes, pub use shapes::Square; resolves to the local module, and the same holds for a name another use bound. So the case rust-edition-2018-use-local-module-over-crate-edge asserts the edge to the local module and none to the crate, not silence. The examiner should judge this line against rustc.

Assumed: the names read are the modules a module declares and the names its use declarations bind, looked up through the blocks around the use and stopping at the module; a name two uses bind to different paths (one per cfg) leaves the path as written; other items in scope (an enum for use Shape::*) are not read, since they name the same file.

