# 516 · Edition 2015: a path dependency wins over the root's own module of that name

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-adte
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-dep2015s
**Where:** src/relations/extractors/rust-resolve.mts:127

## What
Claim: resolveRustPath checks path dependencies before the edition 2015 crate-relative rule. In 2015 a use path is relative to the crate root and a dependency is reachable from `use` only through an `extern crate` there, so with a root `mod util;` and no `extern crate util;`, `use util::slug;` names the local module.

p15: src/api/client.rs:1 -> node:depsrc (the dependency) instead of node:localutil. Rust Reference, Preludes, Extern prelude: in the 2015 edition crates in the extern prelude cannot be referenced via use declarations. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: In a 2015 target, resolve a bare first segment through the root first: a root item or module of that name wins, and a dependency binds only when the root has `extern crate <name>` for it.

## Evidence

