# 237 · Runes: Cargo — autobins (src/bin/*.rs and src/bin/<name>/main.rs) and edition 2015 (use a::b relative to the crate root) (split off from 188)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust
**Files:** 
**Repo:** ../../../Runes
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**
**Branch:** jarl/237-cargo-autobins-edition
**Merged:** b7950f3f788908ad82b6621dd360081d2c64cb46 in ../../../Runes
**CI:** green

## What
Split off from 188 per the 6.2.0 plan (R6).

## Why



## Acceptance
src/bin/*.rs and src/bin/<name>/main.rs are roots of their own crates, unless autobins = false; in edition 2015 (also the default when [package] gives no edition) use a::b is relative to the crate root; a control case for 2018, where use a::b is an external crate; red→green.

## Changelog
- Fixed: a Rust package's `src/bin/*.rs` and `src/bin/<name>/main.rs` are no crate roots when `autobins = false`, and in edition 2015 (also when `[package]` gives no edition) `use a::b` is read relative to the crate root and gives an edge to the root's module `a`, so a consumer's graph can show new edges and new refusals for such crates; from 2018 on it stays an external crate.

## Evidence


- **ran:** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (fix held back, dist rebuilt from the release branch source) · **saw:** pass 54, fail 2: rust-autobins-off-bin-module-edge and rust-edition-2015-use-crate-root-relative-edge; the 2018 control passes
- **ran:** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (with the fix) · **saw:** pass 56, fail 0; test/relations/extractors/rust-resolve.test.mjs pass 63, fail 0
- **ran:** npm run check; npm run coverage on the committed tree · **saw:** 1914 tests pass, check:dist clean; coverage exit 0, all files 99.05 lines, 94.74 branches, 99.12 functions

docs: README.md: Rust behaviour paragraph: say that autobins = false and edition 2015 (the default without an edition) change how src/bin files and bare use paths resolve
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** tests 1925, pass 1925, fail 0; dist/ is fresh (merge b7950f3f788908ad82b6621dd360081d2c64cb46 on release/1.1.0, catalogue 583)

