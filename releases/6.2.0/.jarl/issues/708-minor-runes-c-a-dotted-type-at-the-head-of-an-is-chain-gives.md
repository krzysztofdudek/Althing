# 708 · Minor: Runes, C#: a dotted type at the head of an is chain gives no edge, and neither does a dotted…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261112T0318-bnzs
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/extractors/csharp-resolve.mts, Runes/src/relations/extractors/csharp-project.mts, Runes/src/relations/extractors/csharp-reach.mts
**Repo:** Runes
**Found by:** rev-645-opus
**Where:** the review of 645, 646, 651, 653, 654, 659, 666, 667, 677, 693
**Branch:** jarl/696-csharp
**Worker:** w-696-opus
**Model:** claude-opus-5-5@xhigh
**Since:** 2026-11-13 16:59

## What
Minor: Runes, C#: a dotted type at the head of an is chain gives no edge, and neither does a dotted type later in the chain: x is Models.Order || b and x is App.Models.Order || x is App.Models.Line give nothing on c5124ca and 90c330f, while a lone x is Models.Line gives the edge; 659's first-type reading leaves a member-access head to the existing reading, which reads none.

## Why


## Acceptance


[test] A dotted type at the head of an is chain, and one later in the chain, gives its edge as a lone x is Models.Line does: x is Models.Order || b and x is App.Models.Order || x is App.Models.Line give edges to the files that declare Order and Line; a unit test and a catalogue case, red at b326704 and green after · by: npm run check

## Changelog
- A dotted type in a chain of `is` tests gives its edge as a lone test does: `x is Models.Order || b` and `x is App.Models.Order || x is App.Models.Line` reach the files that declare `Order` and `Line`, so a graph may show new refusals where such a chain names a type of another component.

## Evidence

### Proof

- **ran (line 1ca0f2e38d37):** nice -n 15 node --test --test-name-pattern='is. chain|is-type-test-chain' test/relations/extractors/csharp.test.mjs test/relations/extractors/csharp-name-resolution-matrix.test.mjs at 213133e (the tests and the case before the fix), in a git archive extraction of 8d31e57 (src and dist equal to b326704's) with the new tests and case copied in, and at 0952eb4 (the fix) and 7693a11 (one more test) · **saw:** 213133e and 8d31e57: csharp-is-type-test-chain-dotted-edge fails (expected edge src/c/Use.cs:3->order not emitted, got none), and both unit tests fail: the chains give only their first names ([2, C+Models, Models] where the lone test gives [2, C+Models, C+Models.Order, Models, Models.Order]) and the field Config is read as a type. 0952eb4: the case and both tests pass; 7693a11: the type-parameter test passes too; the catalogue holds 962 cases; the C# rev is 42
- **ran (line 1ca0f2e38d37):** RUNES_CORPUS_DIR=<the shared corpus cache> node scripts/corpus.mjs gate --only eShop,jellyfin,CleanArchitecture --tier all at 0952eb4; a scratch script comparing every C# file's declarations and extract between git archive extractions of b56f1c1 and 7693a11 on jellyfin · **saw:** corpus gate: passed, 0 added and 0 removed (CleanArchitecture 452, jellyfin 32196, eShop 2017 edges). The extracts differ in 7 jellyfin files, all at chains of enum constants such as x is VideoRangeType.DOVIWithELHDR10Plus || x is ...: the dotted constant is now one receiver of every name (VideoRangeType, DOVIWithELHDR10Plus) where it was the first name alone, and its first name binds the enum type first, so the edges stay the same; declarations unchanged
- **ran (line 1ca0f2e38d37):** nice -n 15 npm run check, then nice -n 15 npm run coverage, at 7693a11 (the tip of jarl/696-csharp, clean tree), each under MemoryMax=12G · **saw:** npm run check: 2686 tests, 2683 pass, 0 fail, 3 skipped; dist/ is fresh. npm run coverage: the same 2683 pass, 0 fail; all files 99.19% lines, 95.83% branches, 99.13% functions

### Notes

Assumed: in the chain the grammar tears apart, (x is App).Models.Order, a head that this file declares as a value or a type reads nothing, as the lone test's dotted reading does; the lone test then still reads a type of the file through the member-access reading (all names but the last), which in a torn chain would always bind that same file, so it is left out.

