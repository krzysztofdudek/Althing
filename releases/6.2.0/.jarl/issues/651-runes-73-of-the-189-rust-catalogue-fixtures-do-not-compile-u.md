# 651 · Runes: 73 of the 189 Rust catalogue fixtures do not compile under rustc (binaries without main, incomplete manifests), and a #[path] inside an inline module is not read

**Status:** in-progress
**Kind:** test
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2002-jwvd
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-578-opus, the last Rust package
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
A fixture rustc refuses tests Runes on code no compiler reads, so a case can pass for a wrong reason; the inline #[path] gap misses a child edge and can give a wrong one to a leftover file.

## Acceptance
[test] Every Rust catalogue fixture compiles under rustc (a test that builds each with a pinned rustc where it is installed, skipped with a reason where it is not), and a #[path] inside an inline module is read, red before and green after · by: npm run check

## Changelog
- Fixed: Rust: a `#[path = "x.rs"] mod x;` inside an inline module loads the file relative to the inline module's directory, and that file owns its directory, so its own `mod child;` finds `child.rs` beside it and no file in a directory of its own name.

## Evidence

### Proof

- **ran (line b5fa069991fb):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (Runes, commit 44e497d, before the fix); node --test test/relations/rust-cases-build.test.mjs with rustc 1.99.1 · **saw:** fail rust-path-attribute-in-inline-module-loaded-file-owns-directory-edge: expected src/outer/loaded.rs:1->child not emitted (got ->decoy); the build test with rustc 1.99.1: pass 2, fail 0 with 46 cases listed as not building yet (of 192: 82 did not build before this work, 36 now build)
- **ran (line b5fa069991fb):** npm run check (Runes, branch jarl/645-runes-rest at 90c330f) · **saw:** tests 2646, pass 2646 (3 skipped: the rustc build tests without rustc on PATH), fail 0, dist/ is fresh; npm run coverage: 99.18 lines, 95.70 branches, 99.19 functions; line 1 is met in part only: the inline path attribute is read, 146 of 192 Rust cases build, 46 do not yet (see the stuck question)

