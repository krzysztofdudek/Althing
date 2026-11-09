# 511 · A module directory under src/bin/ without main.rs becomes its own crate tree

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-vqtp
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-bincommn
**Where:** src/relations/resolve-path.mts:431

## What
Claim: rustTargetFor maps any file at src/bin/<dir>/… to srcDir src/bin/<dir> with root src/bin/<dir>/main.rs, even when that main.rs does not exist. Cargo makes such a directory a target only when main.rs exists; otherwise it is a module of a binary in src/bin/, whose crate:: and super:: paths are lost.

p05: src/bin/common/mod.rs, declared by src/bin/app.rs, gives silence for `use crate::config::Cfg;` and `use super::config::Cfg as C2;`; Rust binds both to src/bin/config/mod.rs (node config). p19 (edition 2015): `use cli::Args;` in src/bin/run/mod.rs is lost the same way. Cargo targets.rs infer_subdirectory: `if main.exists() { … Some((name, main)) } else { None }`. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Treat src/bin/<dir>/ as a crate tree only when src/bin/<dir>/main.rs exists; otherwise give the file the src/bin tree, with root files only when exactly one bin root there declares the module.

## Evidence

