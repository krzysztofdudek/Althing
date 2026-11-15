# 760 · Runes, Rust: an inline path that starts at a path-dependency crate (datacrate::dc() with no use) emits no use, while the same path under cr…

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261115T1054-xbik
**Tags:** api, runes, rust
**Files:** Runes/src/relations/extractors/rust.mts, Runes/docs/api.md
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-rust-inline-extern-crate
**Where:** Runes/src/relations/extractors/rust.mts:372

## What
Claim: At v1.1.0 emitInline keeps only a path that starts at crate, self or super. With datacrate = { path = "datacrate" } in Cargo.toml, use datacrate::dc; resolves to the dependency's lib.rs, and a function that only writes datacrate::dc() (the extern prelude, no use) emits nothing.

repros.sh rust_dep: src/u.rs "use datacrate::dc;" printed resolved to datacrate/src/lib.rs; src/k.rs "pub fn k() { datacrate::dc(); }" printed no use; rust_path: src/ui/f.rs "crate::data::d::f()" printed resolved to src/data/d.rs

## Why


A function that calls a path dependency's item through the crate's name, with no use, has no edge to the dependency, while the same call through crate:: has one, so a layer check misses the more common spelling. A new family tool that uses the readers as they are found it.

## Acceptance
[test] In Rust, datacrate::dc() written in a function body with datacrate = { path = "datacrate" } in Cargo.toml gives a use that binds datacrate/src/lib.rs, and std::mem::swap and a registry crate's path give none, in a unit test and a catalogue case that builds under rustc, red at v1.1.0 (no use) and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

Deferred: after Runes 1.1.0, ruling runes-reader-gaps-stress-test-after-1-1-0

