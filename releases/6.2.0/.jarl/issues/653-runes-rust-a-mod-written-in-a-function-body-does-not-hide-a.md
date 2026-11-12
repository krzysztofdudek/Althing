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

## Evidence

