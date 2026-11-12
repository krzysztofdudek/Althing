# 653 · Runes, Rust: a mod written in a function body does not hide a crate root's extern crate alias of th…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2017-nwsn
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-578-fable
**Where:** the review of 578, 579, 600, 601, 614, 617, 618, 634, 635, 638
**Branch:** jarl/645-runes-rest
**Worker:** w-645-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What
Runes, Rust: a mod written in a function body does not hide a crate root's extern crate alias of the same name. src/lib.rs: extern crate engine_core as core2; pub fn a() { mod core2 { pub struct Engine; } use core2::Engine; }. rustc 1.99.1 binds the local module; release/1.1.0 and the tip of jarl/578-rust-rest both give src/lib.rs:4 -> engine-core, a false edge to another package. The inline-module form of issue 614 is right; this is the function-body form.

## Why


## Acceptance


[test] A mod declared in a function body hides a crate root's extern crate alias of the same name, as rustc binds it (no edge to the other package), as a catalogue case, red before and green after · by: npm run check

## Changelog
- Fixed: Rust: a `mod` written in a function body hides a crate root's `extern crate a as b;` alias of the same name, and a `use` whose path starts with a `mod`, `struct`, `enum`, `union`, `trait` or `type` its own block declares names that item and gives no edge.

## Evidence

### Proof

- **ran (line 414d4905c46d):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (Runes, commit 2f74946, before the fix) · **saw:** fail rust-function-body-local-mod-over-root-extern-crate-alias-edge: unexpected cross-owner edge src/lib.rs:6->engine
- **ran (line 414d4905c46d):** npm run check (Runes, branch jarl/645-runes-rest at 90c330f) · **saw:** tests 2646, pass 2646 (3 skipped: the rustc build tests without rustc on PATH), fail 0, dist/ is fresh; npm run coverage: 99.18 lines, 95.70 branches, 99.19 functions; the case also builds under rustc 1.99.1

### Notes

Assumed: the fix is the extractor's, not the resolver's: a use in a block whose path starts with a mod, struct, enum, union, trait or type alias that block declares is emitted as no path (rev 23), which also silences the earlier cases where such a name was emitted as written (a mod cl {} in a block, an enum cl in a block): two unit tests of rust.test.mjs that expected 'cl::Shadowed', 'cl::V' and 'blocked::G' now expect none, since those names are items of the same file.

