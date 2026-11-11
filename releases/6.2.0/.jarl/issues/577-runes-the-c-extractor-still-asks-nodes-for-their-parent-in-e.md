# 577 · Runes: the C# extractor still asks nodes for their parent in eleven places; a file of qualified field types grows faster than its size (2.97 s at 400 000 characters against 1.32 s at 200 000)

**Status:** open
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

## What


## Why


Every consumer reads C# files through this extractor; a wide C# file then costs more than its size, the same fault 566 removed from five other extractors.

## Acceptance


[compare] The extractors give the same facts on the corpus before and after · by: npm run corpus

## Evidence

