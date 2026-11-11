# 514 · A path through a root glob re-export stays silent, across crates too

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-qytd
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/resolve-path.mts, Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-globroot
**Where:** src/relations/extractors/rust-resolve.mts:280
**After:** 523

## What
Claim: A root item lookup succeeds only when the root names the item; `pub use types::*;` names none, so a path to a glob-re-exported item binds nothing. Across crates this loses the only edge between the importing crate and its path dependency.

p50: app/src/lib.rs:1 `use kit::Order;` gives no edge, where kit's root is `mod types; pub use types::*;`; Rust resolves it to kit's types::Order, re-exported by the root. p41: the same in one crate for `use crate::Order;`. Rust Reference, Use declarations, Glob imports. Same at v1.0.0.

## Why


## Acceptance
- [test] A path to an item that a crate root brings in through a top-level glob re-export (pub use m::*;) binds the root file, as a named re-export of the item does, when the glob's module declares the item (Rust Reference, Use declarations, Glob imports), across a path dependency with the audit's probe p50 as a catalogue case (app/src/lib.rs:1 -> kitroot), red before and green after · by: npm run check
- [test] The same in one crate, with p41 as a catalogue case whose expectation gains src/api/mod.rs:1 -> root, red before and green after · by: npm run check
- [test] When the glob's module does not declare the name, or two top-level globs of the root both bring it in, the path gives no edge, with a case each · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

