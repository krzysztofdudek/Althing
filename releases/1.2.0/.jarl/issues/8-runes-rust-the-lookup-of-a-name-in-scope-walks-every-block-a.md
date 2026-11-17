# 8 · Runes, Rust: the lookup of a name in scope walks every block around the use declaration or path it …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1232-xsvb
**Tags:** performance, runes, rust
**Files:** 
**Repo:** Runes
**Found by:** rev-737-opus
**Where:** the review of 737, 759, 760
**Branch:** jarl/7-rust-scope
**Worker:** w-7-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 14:48

## What
Runes, Rust: the lookup of a name in scope walks every block around the use declaration or path it reads, so a file of deeply nested blocks reads in time that grows with the square of its depth: 16000 nested blocks with one use declaration each take 42 s at v1.1.0 (37 s at the 760 branch), and with one bare path each 5.8 s at the 760 branch against 0.18 s at v1.1.0; the ancestor-walk test counts tree accesses only, so it does not see this cost

## Why


A crafted or generated file can stall every consumer that reads the repository, against the extractors' linear-time guarantee.

## Acceptance


[test] A Rust file of 16000 nested blocks, with one use declaration each and with one bare path each, is read in linear time, in a test bounded in time in the style of the extractor's existing linear-time tests, red before and green after; every existing answer and edge stays as it is · by: npm run check

## Changelog
- in Rust, a file of deeply nested blocks is read in time linear in its depth: 16 000 nested blocks with a `use` in each took 42 s in 1.1.0 and now take a fraction of a second, and the same holds for a path written outside a `use` in each. No finding changes.

## Evidence

### Proof

- **ran (line f690de6280d4):** node --test --test-name-pattern '16 000 nested' test/relations/extractors/rust.test.mjs at bfa8e0e (before the fix) · **saw:** fail 2: a quarter of the depth took 1857 ms, the whole of it 35072 ms (a use in each block); 283 ms and 5133 ms (a path in each)
- **ran (line f690de6280d4):** npm run check at 27ec329 · **saw:** tests 2845, pass 2842, fail 0, skipped 3; dist/ is fresh; 16000 blocks read in about 180 ms (use) and 190 ms (path)

