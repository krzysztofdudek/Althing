# 737 · Runes, Rust: a library rooted at the package root gives no edge for a mod inside a #[path] module of lib.rs

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-svei
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**Found by:** rev-733-opus
**Where:** the review of 713, 733, 734
**Branch:** jarl/737-rust-path-modules
**Worker:** w-737-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 11:24

## What
Runes, Rust: a library rooted at the package root (Cargo.toml [lib] path = "lib.rs") whose lib.rs holds only mod outer { #[path = "loaded.rs"] mod x; } gives no edge for mod child; in outer/loaded.rs, at 8d31e57 and at 94b0558, while rustc 1.99.1 loads outer/loaded.rs. With a mod a; beside it in lib.rs the edge is given, and src/lib.rs in the same shape gives it. A lost edge, never a false one; this branch did not change it.

Moved from issue 737 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A lost true edge hides a dependency from every consumer that checks its architecture with the readers: a false green.

## Acceptance
[test] A library rooted at the package root ([lib] path = "lib.rs") whose lib.rs holds only mod outer { #[path = "loaded.rs"] mod x; } gives the edge for mod child; in outer/loaded.rs, as src/lib.rs in the same shape does, in a catalogue case that builds under rustc, red at v1.1.0 and green after; every existing answer and edge stays as it is · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Evidence

### Notes

Fault not reproduced, nothing changed (confirm-the-fault-before-the-fix). At release/1.2.0 (1f3476b) and at 94b0558, the shape of the issue, Cargo.toml [lib] path = "lib.rs" and lib.rs holding only mod outer { #[path = "loaded.rs"] mod x; }, gives the edge outer/loaded.rs:1 -> outer/child.rs through the catalogue runner, on disk and through a listed view. Also tried: the decoy lib/outer/child.rs and lib/outer/loaded.rs, no edition, src/main.rs beside it, the package in a workspace member, path = "./lib.rs", pub items and a pub fn in lib.rs, the inline module on one line, child as outer/child/mod.rs, and mod a; beside it: every shape gives the edge. The case built under rustc 1.99.1. holdsModulesBeside reads fileIsRoot from rustTargetFor, which is true for a [lib] path file, so the declaresModule argument it passes does not decide it. The 1.1.0 known limit (CHANGELOG.md:114) does not describe the code as it is; the final pass may drop it from the 1.2.0 notes or the owner may close 737 as not reproduced.

