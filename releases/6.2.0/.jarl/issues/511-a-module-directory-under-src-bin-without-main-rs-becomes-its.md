# 511 · A module directory under src/bin/ without main.rs becomes its own crate tree

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-vqtp
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-bincommn
**Where:** src/relations/resolve-path.mts:431
**Branch:** jarl/509-cargo-targets
**Worker:** w-509-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:54

## What
Claim: rustTargetFor maps any file at src/bin/<dir>/… to srcDir src/bin/<dir> with root src/bin/<dir>/main.rs, even when that main.rs does not exist. Cargo makes such a directory a target only when main.rs exists; otherwise it is a module of a binary in src/bin/, whose crate:: and super:: paths are lost.

p05: src/bin/common/mod.rs, declared by src/bin/app.rs, gives silence for `use crate::config::Cfg;` and `use super::config::Cfg as C2;`; Rust binds both to src/bin/config/mod.rs (node config). p19 (edition 2015): `use cli::Args;` in src/bin/run/mod.rs is lost the same way. Cargo targets.rs infer_subdirectory: `if main.exists() { … Some((name, main)) } else { None }`. Same at v1.0.0.

## Why


## Acceptance
- [test] A directory under src/bin/ without main.rs is no crate of its own: its files are modules of the binary in src/bin/ that declares them, and their crate:: and super:: paths resolve in that binary's tree (Cargo targets.rs, infer_subdirectory: a directory is a target only if main.rs exists), with the audit's probes p05 (src/bin/common/mod.rs:1 and :2 -> config) and p19 (edition 2015, src/bin/run/mod.rs:1 -> cli) as catalogue cases, red before and green after · by: npm run check
- [test] When no binary or two or more binaries in src/bin/ declare such a directory's module, its crate:: paths give no edge, with a case · by: npm run check
- [test] A directory under src/bin/ that holds main.rs stays a crate of its own, with a case · by: npm run check

## Evidence

