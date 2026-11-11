# 508 · A [lib] path in a subdirectory of src/ keeps src/ as the library's module root

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0440-fvbm
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/resolve-path.mts, Runes/src/relations/extractors/rust-resolve.mts
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-libsubdr
**Where:** src/relations/resolve-path.mts:449
**Branch:** jarl/507-rust-roots
**Worker:** w-507-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 09:35

## What
Claim: rustTargetFor gives every non-root file under src/ the tree srcDir 'src' with root files [libRoot, src/main.rs], even when the library root is src/<dir>/lib.rs. crate:: paths from the library's modules then probe src/ instead of the library's directory, falling back to the library root file or to a same-named module of the binary.

p01 ([lib] path = "src/core/lib.rs"): src/core/engine/mod.rs:1 -> node:core instead of node:util; the edge into the root closes a cycle with src/core/lib.rs:1 -> node:engine. p02 (with src/main.rs declaring its own `mod util;`): src/core/engine/mod.rs:1 -> node:bin_util, the binary's module. Cargo targets.rs normalize_lib takes lib.path as written; Rust Reference, Modules: a crate root's `mod x;` is beside it. Same output at v1.0.0.

## Why


## Acceptance
- [test] When the [lib] path lies in a subdirectory of src/, a file under that subdirectory resolves crate:: paths against the library's own directory, with the audit's p01 and p02 as catalogue cases, red before and green after · by: npm run check
- [test] The Rust tests are unchanged apart from the new cases · by: npm run check

## Changelog
- A Cargo package that writes `edition = { workspace = true }` now takes the workspace edition, so its bare `use` paths name registry crates and its auto-discovered binaries and benches keep their edges; a library whose `[lib]` path lies in a subdirectory of `src/` resolves `crate::` paths against that subdirectory. A consumer's graph can show edges it did not show before and lose edges it showed wrongly.

## Evidence

### Proof

- **ran (line 16436722cccf):** nice -n 15 npm run check · **saw:** 2106 tests pass, 0 fail; the six new Rust catalogue cases fail without the fix and pass with it; dist is fresh
- **ran (line d6ca54816aea):** nice -n 15 npm run check · **saw:** 2106 tests pass, 0 fail; no existing Rust case changed, only the six new ones were added

