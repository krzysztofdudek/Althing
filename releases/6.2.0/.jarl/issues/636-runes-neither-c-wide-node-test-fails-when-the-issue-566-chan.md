# 636 · Runes: neither C# wide-node test fails when the issue 566 change of the C# extractor is reverted (r…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1854-sxfp
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-623-fable
**Where:** the review of 623
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:55

## What
Runes: neither C# wide-node test fails when the issue 566 change of the C# extractor is reverted (ratios 4.5 and 4.3, full reads 1.7 s and 2.5 s, so the earlier 10 s bound passed it too); the C# part of that fix has no test that can fail for it

## Why


## Acceptance


[test] A C# wide-node input the extractor before 566 read quadratically fails the ratio bound with 566's C# change reverted and passes on the branch · by: npm run check

## Evidence

### Proof

- **ran (line 10b2a08ab8cb):** node --test --test-name-pattern='three segments' test/relations/extractors/wide-node.test.mjs, in a scratch copy of 811ef62 with csharp.mts of 43e8130^ (the two parent reads of 566 put back), then on d33e6b7 · **saw:** before: fail, a quarter of the input took 7029 ms, the whole of it 152516 ms: over 8 times; after: pass, 829 ms and 3163 ms

### Notes

Assumed: the commit adds the input of three segments, which is red with the two parent reads of 566 put back and green on the branch. In my scratch copies the existing input of two segments was red as well with those reads put back (811ef62 with csharp.mts of 43e8130^: 5876 ms and 140622 ms; this branch's tip with the two reads put back: 1542 ms and 28920 ms), so I could not reproduce that the existing tests pass with the change reverted. The other parts of 566's C# change (the parent of a type body, the loops by child index) read no input quadratically that I could build: lists of 129 000 bases, type arguments, tuple elements and type parameters read at ratios 3.9 to 4.3 with the pre-566 file.

