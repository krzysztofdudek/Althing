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

## Evidence

