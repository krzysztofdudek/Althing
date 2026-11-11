# 499 · C#: a qualified name in a pattern and a non-plain type after `is` give no edge

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-vbnv
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-patterns
**Where:** src/relations/extractors/csharp.mts:1317
**Branch:** jarl/499-csharp-type-positions
**Worker:** w-499-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:51

## What
Claim: The grammar parses `o is App.Models.Order` and a switch arm `Models.Order => …` as a member_access_expression under constant_pattern, and `o is Note[]` and `o is Box<Item>` as an is_expression with a type; the extractor reads neither, so the edge is lost. Pre-existing (5227538 gained `is N.IEnumerable<Order>` through the general qualified-name walk).

probes/csharp p14 lines 4 and 8, p27 lines 3 and 5, p28, p43 line 5 missing; csharp-parse-shapes.mjs output

## Why


## Acceptance
- [test] A qualified type in a pattern (o is App.Models.Order, a qualified type in a not or an or pattern, a switch arm Models.Order => …) gives an edge to that type, with the audit's probes p14 (lines 4 to 8 -> models) and p27 (lines 3, 4 and 5) as catalogue cases, red before and green after · by: npm run check
- [test] An array type and a generic type after is (o is Note[], o is Box<Item>) give an edge to the element type, to the generic type with its arity and to each type argument, with p28 and p43 (lines 4 and 5) as catalogue cases, red before and green after · by: npm run check
- [test] A constant pattern that names an enum member or a constant through its type (s is Status.Active) gives the edge to that type and never to a type named after the member, with a case · by: npm run check

## Evidence

