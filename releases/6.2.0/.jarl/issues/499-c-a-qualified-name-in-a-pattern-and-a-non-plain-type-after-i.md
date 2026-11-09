# 499 · C#: a qualified name in a pattern and a non-plain type after `is` give no edge

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-vbnv
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-patterns
**Where:** src/relations/extractors/csharp.mts:1317

## What
Claim: The grammar parses `o is App.Models.Order` and a switch arm `Models.Order => …` as a member_access_expression under constant_pattern, and `o is Note[]` and `o is Box<Item>` as an is_expression with a type; the extractor reads neither, so the edge is lost. Pre-existing (5227538 gained `is N.IEnumerable<Order>` through the general qualified-name walk).

probes/csharp p14 lines 4 and 8, p27 lines 3 and 5, p28, p43 line 5 missing; csharp-parse-shapes.mjs output

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: In constant_pattern, read a member_access_expression through emitMemberAccessType; add an is_expression case that emits its right-hand type through emitTypeNode.

## Evidence

