# 748 · Runes, C#: an extended property pattern's member path gives a false edge to a type of its first nam…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261115T0559-ghny
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** rev-696-opus
**Where:** the review of 696, 701, 708, 744
**Branch:** jarl/748-property-pattern
**Worker:** w-748-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-15 06:02

## What
Runes, C#: an extended property pattern's member path gives a false edge to a type of its first name: x is { Order.Id: 3 } on a Holder whose field Order has the type Order gives an edge from the file to Order at 8d31e57, 7693a11 and f396769, where x.Order.Id == 3 and x is { Order: { Id: 3 } } give none. The grammar reads the path as a member access inside the subpattern, and the member-access reading takes its first name for a type.

## Why


## Acceptance


[test] In an extended property pattern (x is { Order.Id: 3 }, and in a switch arm or a nested pattern), the member path before the colon gives no edge, as x is { Order: { Id: 3 } } gives none, while a type pattern or a constant pattern inside the subpattern (x is { Order: Models.Order }, x is { Kind: Kinds.A }) keeps its edge; a catalogue case red at c21ceca and green after; the corpus's C# repositories show every removed edge explained as one of these paths · by: npm run check

## Changelog
- The member path of an extended property pattern (`x is { Order.Id: 3 }`, `{ Order.Customer.Name: "a" } =>` in a switch) names members of the value tested and gives no edge to a type named like one of them, as `x is { Order: { Id: 3 } }` gives none; a constant or a type pattern after the colon (`{ Order.Kind: Kind.A }`, `{ Order: Orders.Order }`) still gives its edge.

## Evidence

### Proof

- **ran (line 2f74461f87c5):** node --test --test-name-pattern='property-path|catalogue holds' test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs (at f2b669b, the cases on c21ceca's extractor) · **saw:** red: csharp-pattern-property-path-silence: unexpected cross-owner edge src/web/Check.cs:4->orders (all five paths, lines 4 to 8, gave an edge to orders); csharp-pattern-property-path-beside-types-edge: unexpected cross-owner edge src/web/Check.cs:6->orders (also 8 and 14)
- **ran (line 2f74461f87c5):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs test/relations/extractor-rev.test.mjs (at d97e722) · **saw:** green: tests 315, pass 315, fail 0; the silence case gives no edge, the edge case gives exactly its 10 expected edges (the constant and type patterns after the colon kept)
- **ran (line 2f74461f87c5):** npm run check (at d97e722, clean tree) · **saw:** exit 0: tests 2751, pass 2748, fail 0, skipped 3; dist/ is fresh; the catalogue holds 992 cases
- **ran (line 2f74461f87c5):** node scripts/corpus.mjs verify --only jellyfin,eShop,CleanArchitecture --tier all, with RUNES_CORPUS_DIR on the shared corpus cache, at c21ceca's extractor and again at d97e722 · **saw:** before and after identical, passed: jellyfin 32213 edges, eShop 2017, CleanArchitecture 452, 0 added, 0 removed; a search of the three repositories finds no extended property pattern (45 property patterns, none with a dotted path), so no edge is removed and none is explained
- **ran (line 2f74461f87c5):** npm run coverage (at d97e722) · **saw:** exit 0: all files 99.21 lines, 95.86 branches, 99.03 functions; the new subpattern lines are covered

