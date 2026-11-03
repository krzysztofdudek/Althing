# 514 · A path through a root glob re-export stays silent, across crates too

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-globroot
**Where:** src/relations/extractors/rust-resolve.mts:280

## What
Claim: A root item lookup succeeds only when the root names the item; `pub use types::*;` names none, so a path to a glob-re-exported item binds nothing. Across crates this loses the only edge between the importing crate and its path dependency.

p50: app/src/lib.rs:1 `use kit::Order;` gives no edge, where kit's root is `mod types; pub use types::*;`; Rust resolves it to kit's types::Order, re-exported by the root. p41: the same in one crate for `use crate::Order;`. Rust Reference, Use declarations, Glob imports. Same at v1.0.0.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: When a root file holds a top-level glob `pub use`, resolve the item through the glob's module (bind the module file when it declares the name), or, for a dependency's root, bind the root file: any path that compiles through it depends on that crate.

## Evidence

