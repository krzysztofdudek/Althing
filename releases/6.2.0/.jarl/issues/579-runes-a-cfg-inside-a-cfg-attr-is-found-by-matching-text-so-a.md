# 579 · Runes: a cfg inside a cfg_attr is found by matching text, so a comment between cfg and its parentheses at the head of a root is missed

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T1332-kpmn
**Tags:** runes, rust
**Files:** Runes/src/relations/extractors/rust.mts
**Found by:** jarl
**Where:** rev-509b-opus, the review of the Cargo package (finding 2)
**Repo:** Runes
**Branch:** jarl/578-rust-rest
**Worker:** w-578-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:18

## What


## Why


rust.mts:489 matches the text of a cfg_attr; #![cfg_attr(all(), cfg /* c */ (any()))] at the head of src/lib.rs is missed, and beside mod x; in src/main.rs the release edge src/x.rs:1 -> bin becomes silence. Nobody is expected to write it; the examiner called it a known limit.

## Acceptance


[test] A cfg inside a cfg_attr is read from the parse tree, so a comment inside it changes nothing, with a catalogue case · by: npm run check

## Changelog
- Fixed: In Rust, a `cfg` that a `cfg_attr` applies at the head of a file is read even with a comment inside it (`#![cfg_attr(all(), cfg /* c */ (any()))]`), so the crate root that always compiles a module is told and the module's `crate::` paths give their edges. A consumer's graph can show new edges.

## Evidence

### Proof

- **ran (line 73c4f651d08a):** node --test --test-name-pattern=cfg-attr-cfg-with-comment test/relations/extractors/rust-name-resolution-matrix.test.mjs (case added, before the fix) · **saw:** not ok: expected edge src/x.rs:1->bin not emitted (got src/lib.rs:2->x, src/main.rs:1->x)
- **ran (line 73c4f651d08a):** node --test rust-name-resolution-matrix, rust-resolve, rust, extractor-rev, catalogue, exports test files (after the fix) · **saw:** pass 193/102/60/2/3, fail 0 each; exports pass

