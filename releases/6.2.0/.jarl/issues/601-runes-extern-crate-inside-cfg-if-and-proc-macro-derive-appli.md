# 601 · Runes: extern crate inside cfg_if! and proc_macro_derive applied through cfg_attr are not read

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1446-abug
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 517, 513
**Found by:** jarl
**Where:** w-523-fable, the Rust roots package
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why
Both are common in published crates; a name they bind gives no edge or a wrong one.

## Acceptance
[test] An extern crate inside a cfg_if! block binds its name as a plain one does, and #[cfg_attr(feature = "x", proc_macro_derive(Name))] makes Name a root item, each a catalogue case, red before and green after · by: npm run check

## Changelog
- Fixed: In Rust, an `extern crate` in a branch of `cfg_if!` binds its name as one written outside the macro does, and `#[cfg_attr(feature = "x", proc_macro_derive(Name))]` makes `Name` an item of the crate root. A consumer's graph can show new edges.

## Evidence

### Proof

- **ran (line 0d045930d801):** runCase rust-cfg-if-extern-crate-binds-name-edge and rust-cfg-attr-proc-macro-derive-root-item-edge on a copy of release/1.1.0 and on the branch before the fix · **saw:** not ok on both: expected edge src/lib.rs:9->util not emitted (got src/lib.rs:14->net); expected edge src/lib.rs:1->kit not emitted (got none)
- **ran (line 0d045930d801):** node --test rust-name-resolution-matrix, rust-resolve, rust, extractor-rev, catalogue, resolve-path, exports test files; corpus verify --only ripgrep (after the fix) · **saw:** pass 200/103/60/2/3/38/18, fail 0; corpus verify passed

### Notes

Assumed: rustc cannot fetch the cfg-if crate offline, so the cfg_if! case defines a local macro_rules! cfg_if that expands both branches as cfg-if does; the extractor reads the invocation by its name. The proc-macro case gates the function with cfg(feature = "x") beside the cfg_attr so the crate compiles with and without the feature. Both compile under rustc 1.99.1.

