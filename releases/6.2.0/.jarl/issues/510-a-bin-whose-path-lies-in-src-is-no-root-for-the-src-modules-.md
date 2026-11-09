# 510 · A [[bin]] whose path lies in src/ is no root for the src/ modules it declares

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-qgqk
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-binpthsr
**Where:** src/relations/resolve-path.mts:453

## What
Claim: A [[bin]] with path src/cli.rs is a crate root, but a module it declares under src/ still gets root files [src/lib.rs, src/main.rs]. crate::X there binds the library root when it has an X, and never the binary root.

p06: src/args/mod.rs:1 -> node:lib for `use crate::Opts;`, where src/cli.rs (owner cli) declares `mod args;` and `struct Opts`; Rust gives node:cli. Cargo targets.rs target_path: a declared path is the target's root. v1.0.0 gives the same false edge.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Include declared target paths that lie directly in src/ among the candidate root files of src/ modules, and choose among the roots by which one declares the module (see rust-1-libfirst); with no unique root, stay silent for root items.

## Evidence

