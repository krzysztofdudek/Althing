# 508 · A [lib] path in a subdirectory of src/ keeps src/ as the library's module root

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0440-fvbm
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-libsubdr
**Where:** src/relations/resolve-path.mts:449

## What
Claim: rustTargetFor gives every non-root file under src/ the tree srcDir 'src' with root files [libRoot, src/main.rs], even when the library root is src/<dir>/lib.rs. crate:: paths from the library's modules then probe src/ instead of the library's directory, falling back to the library root file or to a same-named module of the binary.

p01 ([lib] path = "src/core/lib.rs"): src/core/engine/mod.rs:1 -> node:core instead of node:util; the edge into the root closes a cycle with src/core/lib.rs:1 -> node:engine. p02 (with src/main.rs declaring its own `mod util;`): src/core/engine/mod.rs:1 -> node:bin_util, the binary's module. Cargo targets.rs normalize_lib takes lib.path as written; Rust Reference, Modules: a crate root's `mod x;` is beside it. Same output at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: For a file under src/, consider the library root's directory as a candidate tree too: when libRoot lies in a subdirectory of src/ that holds the file, return that directory as srcDir with libRoot as root file, as deepestTree already does for files outside src/.

## Evidence

