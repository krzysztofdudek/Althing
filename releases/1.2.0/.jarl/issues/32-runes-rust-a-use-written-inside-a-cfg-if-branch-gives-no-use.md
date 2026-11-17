# 32 · Runes, Rust: a use written inside a cfg_if! branch gives no use itself

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261117T1551-hufh
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**Found by:** w-7-opus
**Where:** Runes/src/relations/extractors/rust.mts, the cfg_if! reading

## What
After 7, a module or use inside a cfg_if! branch is a name in scope of its module, but the use declaration written inside the branch still emits no use of its own, so the file it imports gives no edge from that line.

## Why
A cfg_if! branch is how many crates pick a platform module, and the import there is lost.

## Acceptance
[test] A use declaration inside a cfg_if! branch gives a use of the path it names, as one outside the macro does, in a catalogue case that builds under rustc, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

### Notes

Deferred: To the next Runes version: a missed use v1.1.0 already had (ruling runes-1-2-0-cut-for-new-findings)

