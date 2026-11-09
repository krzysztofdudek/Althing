# 509 · A module of src/main.rs binds a crate:: item to src/lib.rs when both roots declare the name

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-fikt
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-libfirst
**Where:** src/relations/resolve-path.mts:453

## What
Claim: A file under src/ gets root files [src/lib.rs, src/main.rs] in that order, and resolveFromModuleDir binds the first root that declares the item. In a package with both roots, a module that only src/main.rs declares binds crate::X to the library root whenever the library has an X too.

p46: src/cli/mod.rs:1 -> node:root (src/lib.rs) for `use crate::Opts;`, where src/main.rs declares `mod cli;` and its own `struct Opts`; Rust gives the binary root (node:bin). p54: the same for `crate::Result` with a `type Result` alias in each root. Rust Reference, Paths: `crate` is the root of the current crate. Same output at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Pick the root by the module chain: the root file that declares the first module segment of the importing file (`mod cli;`) is its crate root. When both or neither declare it, stay silent for root items instead of taking the library first.

## Evidence

