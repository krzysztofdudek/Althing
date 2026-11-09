# 522 · An item is bound to a same-named file no mod declares, another binary included

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-mtdw
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-undeclfl
**Where:** src/relations/extractors/rust-resolve.mts:268

## What
Claim: resolveFromModuleDir tries <dir>/<segment>.rs before treating the segment as an item and never checks that a mod declares the file. A function or other item named like a sibling file binds that file, even when the file is another crate's root.

p27: src/bin/server.rs:2 -> node:servebin for `crate::serve()`, where src/bin/serve.rs is a separate binary and serve is a function of server.rs. p28: src/cmd/mod.rs:1 -> node:stale for `use crate::util::parse;`, a function, with a stale undeclared src/util/parse.rs. Rust Reference, Modules. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Accept a candidate module file only when its parent module file declares `mod <segment>` (the declaration is in the symbol table as a mod_item); at the very least never bind another target's root file as a module.

## Evidence

