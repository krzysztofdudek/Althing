# 522 · An item is bound to a same-named file no mod declares, another binary included

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-mtdw
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-undeclfl
**Where:** src/relations/extractors/rust-resolve.mts:268
**Branch:** jarl/514-rust-paths
**Merged:** e9509e1
**Merge check:** npm run check · saw tests 2523, pass 2522, fail 0, skipped 1; catalogue 893 equals the case files; dist fresh after the commit

## What
Claim: resolveFromModuleDir tries <dir>/<segment>.rs before treating the segment as an item and never checks that a mod declares the file. A function or other item named like a sibling file binds that file, even when the file is another crate's root.

p27: src/bin/server.rs:2 -> node:servebin for `crate::serve()`, where src/bin/serve.rs is a separate binary and serve is a function of server.rs. p28: src/cmd/mod.rs:1 -> node:stale for `use crate::util::parse;`, a function, with a stale undeclared src/util/parse.rs. Rust Reference, Modules. Same at v1.0.0.

## Why


## Acceptance
- [test] A path binds a module file only when its parent module declares that module (a mod declaration outside inline modules, one inside a cfg_if! branch included), so a function named like a stale sibling file that no mod declares binds the parent module's file (Rust Reference, Modules), with the audit's probe p28 as a catalogue case (src/cmd/mod.rs:1 -> util, not stale), red before and green after · by: npm run check
- [test] Another target's root file is never bound as a module, with p27 as a catalogue case (silence), red before and green after · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- Fixed: Rust: a file is bound as a module only when a module above it declares it. `use crate::util::parse;` for a function `parse` binds the file that defines it, not a leftover `util/parse.rs` no `mod` declares, and `crate::serve()` in one binary never binds another binary's root file. A consumer that compacts its symbol table keeps a file's `mod:` keys whenever it keeps its `mods:all`. A graph can show edges that move from a leftover file to the module that defines the name.

## Reviews
- **approve** · by rev-514-opus (fresh) · 2026-11-11 · model claude-opus-5-5 · batch 20261111T1914-jujh
  Approve at e762b68, Minor findings only. Re-ran: the full suite (2523 tests, 2522 pass, 0 fail, 1 skipped: go not installed), dist fresh, every new case red over release/1.1.0's code, the corpus gate and verify --tier all passed, and every fixture compiled with rustc 1.99.1 (decoys and stale files poisoned with compile_error!, never read). Rev 11 to 18 is one bump per output-changing commit; e762b68 changes no output (uses() and declarations() identical to 03bbf5f over 1001 Rust files). Catalogue 893 = case files = runCase calls. The 109 corpus lines are react's Rust compiler crates (72 for 518, 36 for 514's pub use reactive::*) and ripgrep's crates/index (518), each true in the source. All ten key kinds the extractor declares (mod:, mods:all, glob:, pathmod:, pathmod-name:, item:, extern:, modfile:, modfile?:) match Grain's per-file rule on release/6.2.0, names do not, and a Grain-style compacted table gives the same references as the full one on react and ripgrep. The three limit cases fail when the code is broken for them. 518 line 2: its text is false for rustc 1.99.1, which compiles a local mod shapes beside a dependency shapes with no ambiguity error and binds the local module; the case asserts that edge; the director should restate the line to the compiler's behaviour before merge (no code change). Minor 1, src/relations/resolve-path.mts:92: a name two cfg-exclusive root globs bring in (#[cfg(unix)] pub use unix::*; #[cfg(windows)] pub use windows::*;, both defining Order) gives no edge, and so does one item two globs reach (b re-exports a::Order); rustc compiles both and the edge is the root file either way: a lost edge, never a false one. Minor 2, src/relations/resolve-path.mts:76 and :102: each mods:all question copies the key's whole file list (filesFor(...).includes), and nearly every Rust file declares mods:all, so the check is linear in the Rust files; a synthetic package with stale files went 0.5 to 0.6 s at 2003 files, 1.4 to 3.1 s at 8003, 3.8 to 11.6 s at 16003 (quadratic); react shows no change. Minor 3, reference/relations/rust/rust-path-loaded-file-relative-path-forms-edge.md:21: the fixture does not compile as written: rustc does not collapse imp/.. without a src/imp/ directory, and the wrap mod's path names src/wrap/platform/tty.rs, which is missing; the tty expectation is Runes's rule for a file nothing loads, not a compiler fact. Noted: under the coverage run (99.15/95.70/99.19, above the thresholds) two timing tests of the Go and C# extractors failed on one throttled core; the plain suite passes them.

## Evidence

### Proof

- **ran (line 7378c50f8742):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-function-named-like-undeclared-sibling-file-edge, rust-inline-module-over-stale-sibling-file-edge and rust-module-declared-in-cfg-if-and-stale-root-file-edge failed (edge to the stale file); after: 0 fail
- **ran (line 7378c50f8742):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the three cases pass; rustc 1.x compiles the fixture of the first
- **ran (line 106c0253c18b):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-other-binary-root-not-a-module-silence failed (src/bin/server.rs:2 -> servebin); after: 0 fail, and rust-other-binary-root-declared-as-module-edge keeps its edge
- **ran (line 106c0253c18b):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; both cases pass
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus · **saw:** corpus gate: passed; verify --tier all passed; this issue moved no golden line (0 removed, none of the 109 added is its)
- **ran (line 7378c50f8742):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check in rust:1-slim (rustc 1.99.1) of the three cases with compile_error! added to each stale file · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-function-named-like-undeclared-sibling-file-edge (src/cmd/mod.rs:1 -> util), rust-inline-module-over-stale-sibling-file-edge and rust-module-declared-in-cfg-if-and-stale-root-file-edge pass and fail over release/1.1.0's code; rustc 1.99.1 compiles all three with the stale files poisoned: never read; the 16 catalogue cases and 2 unit fixtures that gained a mod line still test their crate-root choice (the added mod only makes the fixture valid Rust); forcing mods:all on every file turns rust-module-declared-by-unknown-macro-keeps-file-edge red
- **ran (line 106c0253c18b):** npm run build, npm run grammars, node --test --test-concurrency=6 'test/**/*.test.mjs' in a git-archive extraction of jarl/514-rust-paths at e762b68, then its rebuilt dist/ compared with the committed one (check:dist needs a git checkout); the same test files over release/1.1.0's src and dist (44a06cc) for red before; cargo check of the case's files in rust:1-slim (rustc 1.99.1) · **saw:** at e762b68: tests 2523, pass 2522, fail 0, skipped 1 (the Go oracle, go not installed); the rebuilt dist/ equals the committed dist/; rust-other-binary-root-not-a-module-silence passes and fails over release/1.1.0's code (src/bin/server.rs:2 -> servebin there); rust-other-binary-root-declared-as-module-edge passes; rustc 1.99.1 compiles both
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus; node scripts/corpus.mjs verify --tier all, in the extraction at e762b68 · **saw:** corpus gate: passed; corpus verify: passed; none of the 109 added lines is this issue's, 0 removed

### Notes

Assumed: a file is passed over only where every existing file of the modules above it is known to list all its modules (new key mods:all) and none declares it. A file with an unread macro among its items, an unread inner attribute or a parse error is not known, and the fitting file is bound as before, unless it is another Cargo target's root. Without the pass's table nothing changes, as docs/api.md promises for 1.0 behaviour. Sixteen existing catalogue cases and two unit fixtures used a module no mod declared; each gained the mod line and its edge.

Assumed: a mod with a path attribute still counts as declaring its name, so a path through it resolves as before; where its file is, is not read.

