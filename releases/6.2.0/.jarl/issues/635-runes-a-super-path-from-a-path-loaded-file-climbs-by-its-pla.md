# 635 · Runes: a super:: path from a #[path]-loaded file climbs by its place on disk, not by its module

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1852-nvbs
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 514
**Found by:** jarl
**Where:** w-514-fable, the Rust paths package
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why
rustc resolves super:: by the module tree; a #[path] file sits elsewhere on disk, so climbing by folder binds the wrong module.

## Acceptance
[test] super:: from a file loaded by #[path] binds the parent module rustc names, checked against rustc, a catalogue case red before and green after · by: npm run check

## Changelog
- Fixed: In Rust, `super::` in a file loaded through a `#[path]` attribute names the module of the file that loads it, wherever the two files lie. A consumer's graph can show edges that move to that module.

## Evidence

### Proof

- **ran (line 8cef7553140e):** runCase rust-path-loaded-file-super-is-declaring-module-edge on a copy of release/1.1.0 and on the branch before the fix · **saw:** not ok on both: expected edge src/platform/linux.rs:1->root not emitted (got src/platform/linux.rs:1->platform, src/platform/sock.rs:1->platform)
- **ran (line 8cef7553140e):** node --test rust-name-resolution-matrix, rust-resolve, rust, catalogue, resolve-path, exports test files; corpus verify --only ripgrep (after the fix) · **saw:** pass 201/104/60/3/38/18, fail 0; corpus verify passed

