# 8 · Runes, Rust: the lookup of a name in scope walks every block around the use declaration or path it …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1232-xsvb
**Tags:** performance, runes, rust
**Files:** 
**Repo:** Runes
**Found by:** rev-737-opus
**Where:** the review of 737, 759, 760

## What
Runes, Rust: the lookup of a name in scope walks every block around the use declaration or path it reads, so a file of deeply nested blocks reads in time that grows with the square of its depth: 16000 nested blocks with one use declaration each take 42 s at v1.1.0 (37 s at the 760 branch), and with one bare path each 5.8 s at the 760 branch against 0.18 s at v1.1.0; the ancestor-walk test counts tree accesses only, so it does not see this cost

## Why


A crafted or generated file can stall every consumer that reads the repository, against the extractors' linear-time guarantee.

## Acceptance


[test] A Rust file of 16000 nested blocks, with one use declaration each and with one bare path each, is read in linear time, in a test bounded in time in the style of the extractor's existing linear-time tests, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

