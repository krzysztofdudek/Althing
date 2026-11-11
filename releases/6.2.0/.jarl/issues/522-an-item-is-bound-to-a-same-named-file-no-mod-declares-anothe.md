# 522 · An item is bound to a same-named file no mod declares, another binary included

**Status:** in-progress
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
**Worker:** w-514-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:04

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

## Evidence

### Proof

- **ran (line 7378c50f8742):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-function-named-like-undeclared-sibling-file-edge, rust-inline-module-over-stale-sibling-file-edge and rust-module-declared-in-cfg-if-and-stale-root-file-edge failed (edge to the stale file); after: 0 fail
- **ran (line 7378c50f8742):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; the three cases pass; rustc 1.x compiles the fixture of the first
- **ran (line 106c0253c18b):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs · **saw:** before the fix: rust-other-binary-root-not-a-module-silence failed (src/bin/server.rs:2 -> servebin); after: 0 fail, and rust-other-binary-root-declared-as-module-edge keeps its edge
- **ran (line 106c0253c18b):** npm run check · **saw:** tests 2523, pass 2522, fail 0, skipped 1; dist/ is fresh; both cases pass
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus · **saw:** corpus gate: passed; verify --tier all passed; this issue moved no golden line (0 removed, none of the 109 added is its)

### Notes

Assumed: a file is passed over only where every existing file of the modules above it is known to list all its modules (new key mods:all) and none declares it. A file with an unread macro among its items, an unread inner attribute or a parse error is not known, and the fitting file is bound as before, unless it is another Cargo target's root. Without the pass's table nothing changes, as docs/api.md promises for 1.0 behaviour. Sixteen existing catalogue cases and two unit fixtures used a module no mod declared; each gained the mod line and its edge.

Assumed: a mod with a path attribute still counts as declaring its name, so a path through it resolves as before; where its file is, is not read.

