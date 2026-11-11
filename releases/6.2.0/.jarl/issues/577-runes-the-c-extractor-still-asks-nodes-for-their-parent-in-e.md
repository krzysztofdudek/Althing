# 577 · Runes: the C# extractor still asks nodes for their parent in eleven places; a file of qualified field types grows faster than its size (2.97 s at 400 000 characters against 1.32 s at 200 000)

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1325-iuem
**Tags:** runes, csharp, performance
**Files:** Runes/src/relations/extractors/csharp.mts
**Found by:** jarl
**Where:** the worker's report on 566
**After:** 566
**Repo:** Runes
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What


The C# extractor still climbs parents in two helpers. One of them, declaresVariable (csharp.mts:581-588, called at :1726), is quadratic on malformed tuple deconstruction: lines (A a, B b) = repeated to 388 000 characters take 24.5 s (1.4 s at 97 000, 5.8 s at 194 000), 2.8 of 3.6 s in parent lookups; lines new List<(Order Item, int Index)>( take 6.9 s and grow faster than their size (rev-566b-opus, 566 round 2). The other C# parent calls measured linear.

## Why


Every consumer reads C# files through this extractor; a wide C# file then costs more than its size, the same fault 566 removed from five other extractors.

## Acceptance


[compare] The extractors give the same facts on the corpus before and after · by: npm run corpus

## Changelog
- C#: a file of many deconstruction lines or named-tuple generics is read in time proportional to its size.

## Evidence

### Proof

- **ran (line ecfb51b35eb6):** node scripts/corpus.mjs verify --tier all --only jellyfin,eShop,CleanArchitecture, on e0ddd65 (before) · **saw:** CleanArchitecture 452 edges, jellyfin 32640 edges, eShop 2017 edges; 0 added, 0 removed; corpus verify: passed
- **ran (line ecfb51b35eb6):** node scripts/corpus.mjs verify --tier all --only jellyfin,eShop,CleanArchitecture, on 406c682 (after) · **saw:** CleanArchitecture 452 edges, jellyfin 32640 edges, eShop 2017 edges; 0 added, 0 removed; corpus verify: passed

### Notes

Assumed: no rev, the output is unchanged (the corpus rows). The new wide-node tests first used the 10 second bound, because 623 was not on the release branch; after its merge they use the ratio bound (commit aefb9b0). Measured before and after at 388 000 characters: tuple deconstruction lines 28.9 s to 1.9 s, generic-of-named-tuple lines 6.2 s to 1.1 s. No call of node.parent is left in csharp.mts.

