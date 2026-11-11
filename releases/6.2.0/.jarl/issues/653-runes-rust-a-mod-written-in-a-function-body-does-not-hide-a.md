# 653 · Runes, Rust: a mod written in a function body does not hide a crate root's extern crate alias of th…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2017-nwsn
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-578-fable
**Where:** the review of 578, 579, 600, 601, 614, 617, 618, 634, 635, 638

## What
Runes, Rust: a mod written in a function body does not hide a crate root's extern crate alias of the same name. src/lib.rs: extern crate engine_core as core2; pub fn a() { mod core2 { pub struct Engine; } use core2::Engine; }. rustc 1.99.1 binds the local module; release/1.1.0 and the tip of jarl/578-rust-rest both give src/lib.rs:4 -> engine-core, a false edge to another package. The inline-module form of issue 614 is right; this is the function-body form.

## Why


## Acceptance


## Evidence

