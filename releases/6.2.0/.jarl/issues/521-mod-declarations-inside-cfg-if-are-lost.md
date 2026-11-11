# 521 · mod declarations inside cfg_if! are lost

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-mwhb
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-cfgifmod
**Where:** src/relations/extractors/rust.mts:338
**Branch:** jarl/514-rust-paths
**Merged:** e9509e1
**Merge check:** npm run check · saw tests 2523, pass 2522, fail 0, skipped 1; catalogue 893 equals the case files; dist fresh after the commit

## What
Claim: A file-backed `mod x;` inside a cfg_if! branch is a token tree to the parser, so it emits nothing, though Runes already reads cfg_if! branches for root item names.

p23: silence; Rust declares src/unix/mod.rs or src/other/mod.rs from src/lib.rs:3 and :5. Same at v1.0.0.

## Why


## Acceptance
- [test] A file-backed mod declaration in any braced branch of a top-level cfg_if!, a nested cfg_if! included, gives the edge to that module's file, every branch being a module on some target, with the audit's probe p23 as a catalogue case (src/lib.rs:3 -> unix, src/lib.rs:5 -> other), red before and green after · by: npm run check
- [test] A mod with an inline body or with a #[path] attribute inside a cfg_if! branch follows the same rules as outside it, with a case · by: npm run check

## Changelog
- Fixed: Rust: a `mod x;` inside a branch of `cfg_if!` gives the edge to its file, in every branch, in a nested `cfg_if!` and inside an inline `mod` written there. A graph can show new edges from a platform layer to its modules.

## Reviews
- **approve** · by rev-514-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1914-jujh
  Approve at e762b68, Minor findings only. Re-ran: the full suite (2523 tests, 2522 pass, 0 fail, 1 skipped: go not installed), dist fresh, every new case red over release/1.1.0's code, the corpus gate and verify --tier all passed, and every fixture compiled with rustc 1.99.1 (decoys and stale files poisoned with compile_error!, never read). Rev 11 to 18 is one bump per output-changing commit; e762b68 changes no output (uses() and declarations() identical to 03bbf5f over 1001 Rust files). Catalogue 893 = case files = runCase calls. The 109 corpus lines are react's Rust compiler crates (72 for 518, 36 for 514's pub use reactive::*) and ripgrep's crates/index (518), each true in the source. All ten key kinds the extractor declares (mod:, mods:all, glob:, pathmod:, pathmod-name:, item:, extern:, modfile:, modfile?:) match Grain's per-file rule on release/6.2.0, names do not, and a Grain-style compacted table gives the same references as the full one on react and ripgrep. The three limit cases fail when the code is broken for them. 518 line 2: its text is false for rustc 1.99.1, which compiles a local mod shapes beside a dependency shapes with no ambiguity error and binds the local module; the case asserts that edge; the director should restate the line to the compiler's behaviour before merge (no code change). Minor 1, src/relations/resolve-path.mts:92: a name two cfg-exclusive root globs bring in (#[cfg(unix)] pub use unix::*; #[cfg(windows)] pub use windows::*;, both defining Order) gives no edge, and so does one item two globs reach (b re-exports a::Order); rustc compiles both and the edge is the root file either way: a lost edge, never a false one. Minor 2, src/relations/resolve-path.mts:76 and :102: each mods:all question copies the key's whole file list (filesFor(...).includes), and nearly every Rust file declares mods:all, so the check is linear in the Rust files; a synthetic package with stale files went 0.5 to 0.6 s at 2003 files, 1.4 to 3.1 s at 8003, 3.8 to 11.6 s at 16003 (quadratic); react shows no change. Minor 3, reference/relations/rust/rust-path-loaded-file-relative-path-forms-edge.md:21: the fixture does not compile as written: rustc does not collapse imp/.. without a src/imp/ directory, and the wrap mod's path names src/wrap/platform/tty.rs, which is missing; the tty expectation is Runes's rule for a file nothing loads, not a compiler fact. Noted: under the coverage run (99.15/95.70/99.19, above the thresholds) two timing tests of the Go and C# extractors failed on one throttled core; the plain suite passes them.

## Evidence

### Proof

- **ran (line 2021171fc7db):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-mod-decl-inside-cfg-if-edge and rust-mod-decl-inside-cfg-if-nested-inline-and-path-edge failed (no edge); after: 0 fail
- **ran (line 2021171fc7db):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; both cases pass
- **ran (line a7693e9d2615):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; rust-mod-decl-inside-cfg-if-nested-inline-and-path-edge passes: the mod in an inline mod binds under its directory, the one with a path attribute gives no edge (red before the fix, as line 1)
- **ran (line 2021171fc7db):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check in rust:1-slim (rustc 1.99.1) with cfg-if 1 added to the fixture · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-mod-decl-inside-cfg-if-edge (src/lib.rs:3 -> unix, :5 -> other) and rust-mod-decl-inside-cfg-if-nested-inline-and-path-edge pass and fail over release/1.1.0's code; rustc 1.99.1 compiles both
- **ran (line a7693e9d2615):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check in rust:1-slim (rustc 1.99.1) with cfg-if 1 added · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-mod-decl-inside-cfg-if-nested-inline-and-path-edge passes: the mod in an inline mod binds under its directory, the one with a path attribute behind a doc comment gives no edge; fails over release/1.1.0's code; rustc 1.99.1 compiles it

### Notes

Assumed: a cfg_if! is read where it stands among the items of the file or of an inline module, not in a function body. Two existing cases with a mod in cfg_if! gained that mod's edge.

