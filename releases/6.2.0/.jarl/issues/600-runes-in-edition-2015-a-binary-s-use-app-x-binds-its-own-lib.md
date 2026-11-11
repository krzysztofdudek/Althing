# 600 · Runes: in edition 2015 a binary's use app::X binds its own library without extern crate app;

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1446-vkqf
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 516
**Found by:** jarl
**Where:** w-523-fable, the Rust roots package
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why
Edition 2015 needs extern crate to name a crate; without it rustc rejects the path, so the edge Runes gives is one the compiler never resolves.

## Acceptance
[test] In an edition 2015 binary without extern crate app;, use app::X gives no edge to the library, and with it gives one, each a catalogue case, red before and green after · by: npm run check

## Changelog
- Fixed: In Rust edition 2015, `use app::Engine;` in a target of the package `app` reaches its library only where the crate root writes `extern crate app;`, as rustc reads it; otherwise it names the root's own module `app`, or nothing. A consumer's graph can show edges that move from the library to that module.

## Evidence

### Proof

- **ran (line a8675c1d8fc7):** node --test --test-name-pattern='rust-edition-2015-bin-(own-crate|extern-crate-own)' test/relations/extractors/rust-name-resolution-matrix.test.mjs (before the fix) · **saw:** not ok: expected edge src/main.rs:2->local not emitted (got src/main.rs:2->lib); not ok: unexpected cross-owner edge src/bin/tool.rs:2->lib
- **ran (line a8675c1d8fc7):** node --test rust-name-resolution-matrix, rust-resolve, catalogue, exports test files; node scripts/corpus.mjs verify --only ripgrep,zed --tier all (after the fix) · **saw:** pass 195/102/3/18, fail 0; corpus verify passed, ripgrep 0 added 0 removed

### Notes

Assumed: rustc 1.99.1 refuses use app::Engine; in an edition 2015 binary without extern crate app; (E0432), so the no-edge-to-the-library case is written as a binary whose root declares mod app; (the use binds that module) and the with-extern-crate case carries a second binary whose use stands under cfg(any()) (no edge); both fixtures compile as written. Three older fixtures with no edition (rust-lib-path-outside-src-main-module-edge, rust-integration-test-mod-common-edge, rust-inline-package-table-crate-name-edge) relied on the own name in edition 2015, which rustc refuses; they now write edition 2021, their expectations unchanged.

