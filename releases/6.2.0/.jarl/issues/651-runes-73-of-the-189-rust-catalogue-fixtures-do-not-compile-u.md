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

### Notes

Correction to the first row: the number of cases that did not build before this work is not measured; the issue says 73 of 189, and my own first scan (a build directory shared by all cases, which can report a case fresh without building it) flagged 69 of 192. After the work 46 of 192 are listed as not building (the build test, run with rustc 1.99.1 downloaded to a scratch folder, builds each case in its own folder).

Assumed: the compile test builds with cargo check --offline under rustc and cargo 1.99.1 (the version of the finder's rustc in issue 653) and skips with its reason when they are not on PATH; registry, alternate-registry and git dependencies are stood in for by stub crates in a directory source that declare the items the case's own sources import (test/helpers/rust-fixtures.mjs). The 46 cases that do not build are listed in the test, which fails when one of them starts to build, so the list only shrinks. Not met: line 1 asks for every case. The 46 are: crate skeletons whose completion changes what the case tests (5 where the completed crate gives an edge from an original file), dotted keys written before [package] (not Cargo), [patch] and git sources the stubs do not cover, a proc-macro crate, bench and test targets without their files, macros from crates the stubs do not define (cfg_if!), and rust-module-of-unparsable-lib-root-item-edge, whose root is unparsable on purpose and cannot build.

Assumed: a Rust file loaded through a #[path] inside an inline module is read when the inline module carries no #[path] of its own: the path is relative to the directory of the declaring file with the inline module names in front, after the file's own name when the file is not lib.rs, main.rs or mod.rs (the Rust Reference rule for mod-rs and non-mod-rs files). An inline module that carries its own #[path] moves the directory somewhere this does not follow, so nothing inside it is read. The catalogue case that named the gap a known limit (rust-path-loaded-file-relative-path-forms-edge) now expects the edge.

Ruling ask-39 (stuck, by jarl): The jarl decided (ruling rust-fixtures-build-list): option 1, the list as the first step, the unparsable case exempt by name, the 46 as their own issue.

