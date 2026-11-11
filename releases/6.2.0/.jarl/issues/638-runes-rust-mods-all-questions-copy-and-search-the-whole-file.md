# 638 · Runes, Rust: mods:all questions copy and search the whole file list (quadratic on large packages: 3.8 s to 11.6 s at 16 003 files), two root globs gated by opposite cfgs give no edge, and one path-loaded catalogue fixture does not compile

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1915-woun
**Tags:** runes, rust, performance
**Files:** 
**Repo:** Runes
**After:** 514
**Found by:** jarl
**Where:** rev-514-opus, the Rust paths package (resolve-path.mts:76, :92, :102; reference/relations/rust/rust-path-loaded-file-relative-path-forms-edge.md:21)
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why
Nearly every Rust file declares mods:all, so each resolution is linear in the package's Rust files and the pass grows with the square; a cfg(unix)/cfg(windows) pair of globs loses its edge; and a fixture rustc refuses tests Runes on code no compiler reads.

## Acceptance
[test] A synthetic package of 16 000 Rust files resolves within a small factor of release/1.1.0's time under the wide-node ratio bound; two root globs under opposite cfgs reaching one Order give the root edge; the path-loaded fixture compiles under rustc as written, each red before and green after · by: npm run check

## Evidence

