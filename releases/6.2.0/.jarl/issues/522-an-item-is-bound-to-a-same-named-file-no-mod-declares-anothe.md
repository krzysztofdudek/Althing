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

## Evidence

