# 519 · Edition 2015 use ::m::X is lost

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-jaep
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts, Runes/src/relations/extractors/rust-resolve.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-lead2015
**Where:** src/relations/extractors/rust.mts:109
**Branch:** jarl/514-rust-paths
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

## What
Claim: In edition 2015 a path that starts with :: is relative to the crate root. The extractor returns no specifier for a scoped identifier without a path prefix, so the path is dropped.

p14: silence for src/api/client.rs `use ::shapes::Circle;`, which Rust resolves to src/shapes/mod.rs (node shapes). Rust Reference, Paths, Path qualifiers. Same at v1.0.0.

## Why


## Acceptance
- [test] In edition 2015 a use path that starts with :: is relative to the crate root (Rust Reference, Paths, Path qualifiers), so use ::shapes::Circle; binds the root's module, with the sceptic's probe s15 as a catalogue case (src/api/b.rs:1 -> shapes; the audit's p14 does not compile as written), red before and green after · by: npm run check
- [test] From edition 2018 a path that starts with :: names a crate only: it never binds a module of the crate, and it binds a path dependency of that name, with a case · by: npm run check

## Changelog
- Fixed: Rust: a `use` path that starts with `::` gives an edge. In edition 2015 `use ::shapes::Circle;` binds the crate root's module `shapes`; from edition 2018 on it names a crate only, so it binds a path dependency of that name and never a module of the crate.

## Reviews
- **approve** · by rev-514-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1914-jujh
  Approve at e762b68, Minor findings only. Re-ran: the full suite (2523 tests, 2522 pass, 0 fail, 1 skipped: go not installed), dist fresh, every new case red over release/1.1.0's code, the corpus gate and verify --tier all passed, and every fixture compiled with rustc 1.99.1 (decoys and stale files poisoned with compile_error!, never read). Rev 11 to 18 is one bump per output-changing commit; e762b68 changes no output (uses() and declarations() identical to 03bbf5f over 1001 Rust files). Catalogue 893 = case files = runCase calls. The 109 corpus lines are react's Rust compiler crates (72 for 518, 36 for 514's pub use reactive::*) and ripgrep's crates/index (518), each true in the source. All ten key kinds the extractor declares (mod:, mods:all, glob:, pathmod:, pathmod-name:, item:, extern:, modfile:, modfile?:) match Grain's per-file rule on release/6.2.0, names do not, and a Grain-style compacted table gives the same references as the full one on react and ripgrep. The three limit cases fail when the code is broken for them. 518 line 2: its text is false for rustc 1.99.1, which compiles a local mod shapes beside a dependency shapes with no ambiguity error and binds the local module; the case asserts that edge; the director should restate the line to the compiler's behaviour before merge (no code change). Minor 1, src/relations/resolve-path.mts:92: a name two cfg-exclusive root globs bring in (#[cfg(unix)] pub use unix::*; #[cfg(windows)] pub use windows::*;, both defining Order) gives no edge, and so does one item two globs reach (b re-exports a::Order); rustc compiles both and the edge is the root file either way: a lost edge, never a false one. Minor 2, src/relations/resolve-path.mts:76 and :102: each mods:all question copies the key's whole file list (filesFor(...).includes), and nearly every Rust file declares mods:all, so the check is linear in the Rust files; a synthetic package with stale files went 0.5 to 0.6 s at 2003 files, 1.4 to 3.1 s at 8003, 3.8 to 11.6 s at 16003 (quadratic); react shows no change. Minor 3, reference/relations/rust/rust-path-loaded-file-relative-path-forms-edge.md:21: the fixture does not compile as written: rustc does not collapse imp/.. without a src/imp/ directory, and the wrap mod's path names src/wrap/platform/tty.rs, which is missing; the tty expectation is Runes's rule for a file nothing loads, not a compiler fact. Noted: under the coverage run (99.15/95.70/99.19, above the thresholds) two timing tests of the Go and C# extractors failed on one throttled core; the plain suite passes them.

## Evidence

### Proof

- **ran (line 0888b77b3d35):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-edition-2015-use-leading-colons-root-module-edge failed (src/api/b.rs:1 -> shapes not emitted); after: 0 fail
- **ran (line 0888b77b3d35):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the case passes
- **ran (line 82666487dc6d):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-edition-2018-use-leading-colons-crate-only-edge failed (src/lib.rs:1 -> dep not emitted); after: 0 fail, and the root's module shapes gets no edge from use ::shapes::Circle;
- **ran (line 82666487dc6d):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the case passes; rustc 1.x refuses use ::shapes::Circle; for a local module (E0432) and binds ::kit to the dependency
- **ran (line 0888b77b3d35):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check of the case's files in rust:1-slim (rustc 1.99.1) · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-edition-2015-use-leading-colons-root-module-edge passes (src/api/b.rs:1 -> shapes) and fails over release/1.1.0's code; rustc 1.99.1 compiles the edition 2015 fixture
- **ran (line 82666487dc6d):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check of the case's files in rust:1-slim (rustc 1.99.1) · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-edition-2018-use-leading-colons-crate-only-edge passes (src/lib.rs:1 -> dep, no edge to the local shapes) and fails over release/1.1.0's code; rustc 1.99.1 binds ::kit to the dependency beside a local mod kit and refuses use ::shapes::Circle; for a local module (E0432)

