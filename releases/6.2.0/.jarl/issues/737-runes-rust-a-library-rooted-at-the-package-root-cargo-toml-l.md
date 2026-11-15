# 737 · Runes, Rust: a library rooted at the package root (Cargo.toml [lib] path = "lib.rs") whose lib.rs h…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261113T1723-irzw
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-733-opus
**Where:** the review of 713, 733, 734

## What
Runes, Rust: a library rooted at the package root (Cargo.toml [lib] path = "lib.rs") whose lib.rs holds only mod outer { #[path = "loaded.rs"] mod x; } gives no edge for mod child; in outer/loaded.rs, at 8d31e57 and at 94b0558, while rustc 1.99.1 loads outer/loaded.rs. With a mod a; beside it in lib.rs the edge is given, and src/lib.rs in the same shape gives it. A lost edge, never a false one; this branch did not change it.

## Why


## Acceptance


## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-1-1-0-review-findings-after

