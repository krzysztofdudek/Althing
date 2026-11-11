# 579 · Runes: a cfg inside a cfg_attr is found by matching text, so a comment between cfg and its parentheses at the head of a root is missed

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T1332-kpmn
**Tags:** runes, rust
**Files:** Runes/src/relations/extractors/rust.mts
**Found by:** jarl
**Where:** rev-509b-opus, the review of the Cargo package (finding 2)
**Repo:** Runes

## What


## Why


rust.mts:489 matches the text of a cfg_attr; #![cfg_attr(all(), cfg /* c */ (any()))] at the head of src/lib.rs is missed, and beside mod x; in src/main.rs the release edge src/x.rs:1 -> bin becomes silence. Nobody is expected to write it; the examiner called it a known limit.

## Acceptance


[test] A cfg inside a cfg_attr is read from the parse tree, so a comment inside it changes nothing, with a catalogue case · by: npm run check

## Evidence

