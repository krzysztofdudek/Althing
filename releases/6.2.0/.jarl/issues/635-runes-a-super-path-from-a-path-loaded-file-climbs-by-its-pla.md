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

## Evidence

