# 578 · Runes: in a src/bin directory without main.rs, a mod declaration under a cfg still counts toward two binaries, so the directory gets no crate and a release edge becomes silence

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1331-dfxy
**Tags:** runes, rust
**Files:** Runes/src/relations/resolve-path.mts Runes/src/relations/extractors/rust-resolve.mts
**Found by:** jarl
**Where:** rev-509b-opus, the review of the Cargo package (finding 1, src/relations/resolve-path.mts:306)
**Repo:** Runes
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why


511 roots a src/bin directory only when one binary declares it; a binary whose declaration sits under a cfg may not compile the module at all, yet it counts as the second declaring binary, so an edge release/1.1.0 gave is lost. Repro: app.rs has mod common; pub use common::Opts;, tool.rs the same under #[cfg(feature = "x")], common/mod.rs defines Opts, common/x.rs has use crate::Opts;: release gives src/bin/common/x.rs:1 -> common, the tip of 509's package nothing.

## Acceptance


[test] A src/bin directory that one binary declares plainly and another only under a cfg is rooted at the plain one, as 509 does for src/lib.rs and src/main.rs, with the repro as a catalogue case, red before and green after · by: npm run check

## Evidence

### Proof

- **ran (line 2644c53d0cbe):** node --test --test-name-pattern=plain-and-cfg test/relations/extractors/rust-name-resolution-matrix.test.mjs (before the fix, on the base) · **saw:** not ok: case rust-bin-shared-module-plain-and-cfg-bins-edge: expected edge src/bin/common/x.rs:1->bin not emitted
- **ran (line 2644c53d0cbe):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs, rust-resolve.test.mjs, catalogue.test.mjs (after the fix, 74c0e7c) · **saw:** pass 192 fail 0; pass 102 fail 0; pass 3 fail 0

### Notes

Assumed: binaries that declare the directory only under a cfg stand after the one that certainly compiles it in the probe order, and two binaries that both declare it only under a cfg are probed in order too (as src/lib.rs and src/main.rs are, which docs/api.md already states); only two or more that certainly compile it leave the crate untold. Checked against rustc 1.99.1: the case compiles with and without --features x.

