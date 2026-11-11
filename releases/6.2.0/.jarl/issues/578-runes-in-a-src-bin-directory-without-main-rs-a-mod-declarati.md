# 578 · Runes: in a src/bin directory without main.rs, a mod declaration under a cfg still counts toward two binaries, so the directory gets no crate and a release edge becomes silence

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1331-dfxy
**Tags:** runes, rust
**Files:** Runes/src/relations/resolve-path.mts Runes/src/relations/extractors/rust-resolve.mts
**Found by:** jarl
**Where:** rev-509b-opus, the review of the Cargo package (finding 1, src/relations/resolve-path.mts:306)
**Repo:** Runes

## What


## Why


511 roots a src/bin directory only when one binary declares it; a binary whose declaration sits under a cfg may not compile the module at all, yet it counts as the second declaring binary, so an edge release/1.1.0 gave is lost. Repro: app.rs has mod common; pub use common::Opts;, tool.rs the same under #[cfg(feature = "x")], common/mod.rs defines Opts, common/x.rs has use crate::Opts;: release gives src/bin/common/x.rs:1 -> common, the tip of 509's package nothing.

## Acceptance


[test] A src/bin directory that one binary declares plainly and another only under a cfg is rooted at the plain one, as 509 does for src/lib.rs and src/main.rs, with the repro as a catalogue case, red before and green after · by: npm run check

## Evidence

