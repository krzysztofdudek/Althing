# 518 · Edition 2018 uniform paths are lost

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-ukah
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-uniform1
**Where:** src/relations/extractors/rust-resolve.mts:139

## What
Claim: From edition 2018 a use path may start with a name in scope in the current module: a module it declares, or a name an earlier use bound. Runes treats every such bare first segment as an external crate.

p12: src/lib.rs `mod shapes; pub use shapes::Circle;` gives only line 1, line 2 is lost. p13: `use crate::shapes; use shapes::Circle;` gives only line 1. p50: kit/src/lib.rs:2 `pub use types::*;` is lost. Rust Reference, Use declarations (uniform paths). Same at v1.0.0. Most lost lines repeat an edge the same file already has, which keeps the severity low.

## Why


## Acceptance
- [test] From edition 2018, the first segment of a use path that names a module the importing module declares (mod shapes; pub use shapes::Circle;) or a name an earlier use of that module brought in (use crate::shapes; use shapes::Circle;) resolves in the crate (Rust Reference, Use declarations, uniform paths), with the audit's probe p12 (src/lib.rs:2 -> shapes), the sceptic's probe s13 (src/api/client.rs:2 -> shapes, src/api/other.rs:2 -> round) and p50 (kit/src/lib.rs:2 -> types) as catalogue cases, red before and green after · by: npm run check
- [test] A first segment that names both such a local name and a crate (an error in Rust) gives no edge, and a first segment that names only a crate keeps binding that crate, with a case each · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

