# 760 · Runes, Rust: an inline path that starts at a path-dependency crate emits no use

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-ovte
**Tags:** api, runes, rust
**Files:** Runes/src/relations/extractors/rust.mts
**Repo:** Runes
**Found by:** jarl
**Source:** research/2026-11-15-runes-readers-gaps-bundler-python-rust-after-1-1-0#runes-readers-2026-11-15-rust-inline-extern-crate
**Where:** Runes/src/relations/extractors/rust.mts:372
**Branch:** jarl/737-rust-path-modules
**Worker:** w-737-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 11:24

## What
Claim: At v1.1.0 emitInline keeps only a path that starts at crate, self or super. With datacrate = { path = "datacrate" } in Cargo.toml, use datacrate::dc; resolves to the dependency's lib.rs, and a function that only writes datacrate::dc() (the extern prelude, no use) emits nothing.

repros.sh rust_dep: src/u.rs "use datacrate::dc;" printed resolved to datacrate/src/lib.rs; src/k.rs "pub fn k() { datacrate::dc(); }" printed no use; rust_path: src/ui/f.rs "crate::data::d::f()" printed resolved to src/data/d.rs

Moved from issue 760 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A function that calls a path dependency's item through the crate's name, with no use, has no edge to the dependency, while the same call through crate:: has one, so a layer check misses the more common spelling. A new family tool that uses the readers as they are found it.

## Acceptance
[test] In Rust, datacrate::dc() written in a function body with datacrate = { path = "datacrate" } in Cargo.toml gives a use that binds datacrate/src/lib.rs, and std::mem::swap and a registry crate's path give none, in a unit test and a catalogue case that builds under rustc, red at v1.1.0 (no use) and green after; every existing answer and edge stays as it is · by: npm run check; node --test test/relations/rust-cases-build.test.mjs with cargo and rustc 1.99.1 on PATH (the briefs' wrappers), both build tests run and none is skipped

## Evidence

