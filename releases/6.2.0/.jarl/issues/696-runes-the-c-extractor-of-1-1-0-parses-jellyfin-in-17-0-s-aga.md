# 696 · Runes: the C# extractor of 1.1.0 parses jellyfin in 17.0 s against 11.3 s in 1.0.0

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0156-hayw
**Tags:** runes, csharp, performance
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/extractors/csharp-resolve.mts, Runes/src/relations/extractors/csharp-project.mts, Runes/src/relations/extractors/csharp-reach.mts
**Repo:** Runes
**After:** 686
**Found by:** jarl
**Where:** w-686-sonnet, 686 report (measured on a harness over the corpus's C# files)

## What


## Why
After 686 the resolver is faster than 1.0.0, so the extractor's added time is now the larger part of what Runes 1.1.0 costs on a large C# repository.

## Acceptance
[compare] The C# extractor's parse time on jellyfin and eShop is no more than 1.15 times Runes 1.0.0's, measured on one machine and written in the evidence, with byte-identical extracts · by: npm run corpus

## Evidence

