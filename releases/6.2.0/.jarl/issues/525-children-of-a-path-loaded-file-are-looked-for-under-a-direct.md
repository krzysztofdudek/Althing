# 525 · Children of a #[path]-loaded file are looked for under a directory named after it

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-vggw
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts, Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-pathkids
**Where:** src/relations/extractors/rust-resolve.mts:200
**Branch:** jarl/514-rust-paths
**Merged:** e9509e1
**Merge check:** npm run check · saw tests 2523, pass 2522, fail 0, skipped 1; catalogue 893 equals the case files; dist fresh after the commit

## What
Claim: A file loaded through #[path] outside inline modules owns its directory as a mod-rs file does, so its `mod x;` is beside it. Runes does not know the file was loaded through #[path] and treats it as a non-mod-rs file.

p53: silence for src/platform/linux.rs `mod epoll;`, which Rust resolves to src/platform/epoll/mod.rs (node epoll); Runes probes src/platform/linux/epoll.rs. Rust Reference, Modules, The path attribute. Same at v1.0.0.

## Why


## Acceptance
- [test] A file loaded through a #[path] attribute on a mod outside inline modules owns its directory as a mod.rs file does, so its mod x; binds x.rs or x/mod.rs beside it (Rust Reference, Modules, The path attribute), with the audit's probe p53 as a catalogue case (src/platform/linux.rs:1 -> epoll), red before and green after; the #[path] mod itself still gives no edge · by: npm run check
- [test] The same file declared by convention, without #[path], still looks for its children under the directory named after it, with a case · by: npm run check

## Changelog
- Fixed: Rust: a file loaded through `#[path = "…"]` on a `mod` owns its directory as a `mod.rs` does, so its own `mod x;` binds `x.rs` or `x/mod.rs` beside it. A graph can show new edges from such a file to its modules.

## Reviews
- **approve** · by rev-514-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1914-jujh
  Approve at e762b68, Minor findings only. Re-ran: the full suite (2523 tests, 2522 pass, 0 fail, 1 skipped: go not installed), dist fresh, every new case red over release/1.1.0's code, the corpus gate and verify --tier all passed, and every fixture compiled with rustc 1.99.1 (decoys and stale files poisoned with compile_error!, never read). Rev 11 to 18 is one bump per output-changing commit; e762b68 changes no output (uses() and declarations() identical to 03bbf5f over 1001 Rust files). Catalogue 893 = case files = runCase calls. The 109 corpus lines are react's Rust compiler crates (72 for 518, 36 for 514's pub use reactive::*) and ripgrep's crates/index (518), each true in the source. All ten key kinds the extractor declares (mod:, mods:all, glob:, pathmod:, pathmod-name:, item:, extern:, modfile:, modfile?:) match Grain's per-file rule on release/6.2.0, names do not, and a Grain-style compacted table gives the same references as the full one on react and ripgrep. The three limit cases fail when the code is broken for them. 518 line 2: its text is false for rustc 1.99.1, which compiles a local mod shapes beside a dependency shapes with no ambiguity error and binds the local module; the case asserts that edge; the director should restate the line to the compiler's behaviour before merge (no code change). Minor 1, src/relations/resolve-path.mts:92: a name two cfg-exclusive root globs bring in (#[cfg(unix)] pub use unix::*; #[cfg(windows)] pub use windows::*;, both defining Order) gives no edge, and so does one item two globs reach (b re-exports a::Order); rustc compiles both and the edge is the root file either way: a lost edge, never a false one. Minor 2, src/relations/resolve-path.mts:76 and :102: each mods:all question copies the key's whole file list (filesFor(...).includes), and nearly every Rust file declares mods:all, so the check is linear in the Rust files; a synthetic package with stale files went 0.5 to 0.6 s at 2003 files, 1.4 to 3.1 s at 8003, 3.8 to 11.6 s at 16003 (quadratic); react shows no change. Minor 3, reference/relations/rust/rust-path-loaded-file-relative-path-forms-edge.md:21: the fixture does not compile as written: rustc does not collapse imp/.. without a src/imp/ directory, and the wrap mod's path names src/wrap/platform/tty.rs, which is missing; the tty expectation is Runes's rule for a file nothing loads, not a compiler fact. Noted: under the coverage run (99.15/95.70/99.19, above the thresholds) two timing tests of the Go and C# extractors failed on one throttled core; the plain suite passes them.

## Evidence

### Proof

- **ran (line 7e8d31e02413):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-path-loaded-file-children-beside-it-edge and rust-path-loaded-file-relative-path-forms-edge failed; after: 0 fail; the path mod itself gives no edge
- **ran (line 7e8d31e02413):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; both cases pass; rustc 1.x compiles the fixture
- **ran (line a72ce2a3275b):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; rust-file-module-children-under-own-directory-edge passes (also before the fix: it holds the unchanged rule)
- **ran (line 7e8d31e02413):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check in rust:1-slim (rustc 1.99.1) with compile_error! in the decoy src/platform/linux/epoll.rs, and of rust-path-loaded-file-relative-path-forms-edge as written and with a file added under src/imp/ · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-path-loaded-file-children-beside-it-edge (src/platform/linux.rs:1 -> epoll, the path mod itself silent) and rust-path-loaded-file-relative-path-forms-edge pass and fail over release/1.1.0's code; rustc 1.99.1 compiles the first with the decoy poisoned; the second does not compile as written (couldn't find file src/./imp/../platform/bsd.rs: no src/imp/ directory) and, with one added, only on the wrap mod (src/wrap/platform/tty.rs missing)
- **ran (line a72ce2a3275b):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; the built resolve-path.mjs edited in a scratch copy so that every file counts as loaded through a path attribute · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-file-module-children-under-own-directory-edge passes before and after; with every file counted as path-loaded it turns red, so it can fail for the right reason

### Notes

Assumed: only a path attribute on a mod without a body at the top level of a file is read (not inside an inline module, a cfg_attr or a macro). The loaded file's mod and self:: paths look beside it first and under the directory named after it second, since the file can be a module by its name too. Its super:: paths are read as before.

