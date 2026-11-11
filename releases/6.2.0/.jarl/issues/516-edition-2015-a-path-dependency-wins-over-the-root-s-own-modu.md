# 516 · Edition 2015: a path dependency wins over the root's own module of that name

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-adte
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust-resolve.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-dep2015s
**Where:** src/relations/extractors/rust-resolve.mts:127
**After:** 517, 523

## What
Claim: resolveRustPath checks path dependencies before the edition 2015 crate-relative rule. In 2015 a use path is relative to the crate root and a dependency is reachable from `use` only through an `extern crate` there, so with a root `mod util;` and no `extern crate util;`, `use util::slug;` names the local module.

p15: src/api/client.rs:1 -> node:depsrc (the dependency) instead of node:localutil. Rust Reference, Preludes, Extern prelude: in the 2015 edition crates in the extern prelude cannot be referenced via use declarations. Same at v1.0.0.

## Why


## Acceptance
- [test] In edition 2015, the first segment of a use path that the crate root declares as a module or an item binds the root's module, and a path dependency of that name binds only when the root writes extern crate for it (Rust Reference, Preludes, Extern prelude: in the 2015 edition, crates in the extern prelude cannot be referenced via use declarations), with the sceptic's probe s15 as a catalogue case (src/api/a.rs:1 -> localutil; the audit's p15 does not compile as written), red before and green after · by: npm run check
- [test] In edition 2015, a use path whose first segment is neither a root module or item nor a crate the root binds with extern crate gives no edge, with a case · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

