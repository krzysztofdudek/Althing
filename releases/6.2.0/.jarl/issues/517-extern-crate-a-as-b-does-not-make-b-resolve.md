# 517 · extern crate a as b; does not make b resolve

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-tvdv
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/rust.mts, Runes/src/relations/extractors/rust-resolve.mts, Runes/src/relations/resolve-path.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#rust-1-externas
**Where:** src/relations/extractors/rust.mts:352

## What
Claim: The extractor emits `extern crate a as b;` as the crate a and drops the alias, and the resolver knows no alias. A later `use b::X;` stays silent, in edition 2015 (b is a root item) and from 2018 on (b is in the extern prelude).

p16 (2015) and p17 (2021): src/api/client.rs:1 `use core2::Engine;` gives no edge, where the root has `extern crate engine_core as core2;`; Rust binds the dependency engine-core. Rust Reference, Extern crate declarations and Preludes, Extern prelude. Same at v1.0.0.

## Why


## Acceptance
- [test] extern crate a as b; at the crate root makes b name the path dependency a in every module of that crate, in edition 2015 and from 2018 on (Rust Reference, Extern crate declarations; Preludes, Extern prelude), with the sceptic's probes s15 (src/api/c.rs:1 -> dep) and s17 (src/api/client.rs:1 -> dep) as catalogue cases (the audit's p16 and p17 do not compile as written), red before and green after · by: npm run check
- [test] extern crate a as b; in a module other than the root binds b in that module only, with a case · by: npm run check

## Evidence

