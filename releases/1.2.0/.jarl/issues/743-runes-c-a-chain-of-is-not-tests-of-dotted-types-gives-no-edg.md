# 743 · Runes, C#: a chain of is not tests of dotted types gives no edge

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-nvgi
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**Found by:** rev-696-opus
**Where:** the review of 696, 701, 708
**Branch:** jarl/743-csharp-patterns
**Worker:** w-743-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 11:00

## What
Runes, C#: a chain of is not tests of dotted types gives no edge: x is not App.Models.Order || x is not App.Models.Line, and the same with &&, give nothing at 8d31e57 and at 7693a11, while a lone x is not App.Models.Order gives the edge to Order. The grammar reads the chain as (x is not App).Models.Order || (x is not App).Models.Line, and its constant pattern sits under a negated pattern, which 708's reading of torn chains does not reach (it asks for the is test as the pattern's parent). 708's changelog line, a dotted type in a chain of is tests gives its edge as a lone test does, reads as covering this form.

Moved from issue 743 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A lost true edge hides a dependency from every consumer that checks its architecture with the readers: a false green.

## Acceptance
[test] x is not App.Models.Order || x is not App.Models.Line, and the same with &&, give the edges to Order and Line, as a lone x is not App.Models.Order does, in catalogue cases red at v1.1.0 and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

