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

