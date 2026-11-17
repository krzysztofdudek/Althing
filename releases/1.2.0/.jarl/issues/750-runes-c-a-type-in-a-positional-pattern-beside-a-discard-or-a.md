# 750 · Runes, C#: a type in a positional pattern beside a discard or a constant gives no edge

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-twkd
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**Found by:** rev-748-opus
**Where:** the review of 748
**Branch:** jarl/743-csharp-patterns
**Worker:** w-743-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-17 11:00

## What
Runes, C#: a type in a positional pattern beside a discard or a constant (x is (Order, _), x is (Models.Order, _), x is (App.Models.Order, 1), a switch arm (Models.Order, _) =>) gives no edge, at c21ceca and at d97e722 alike: the grammar reads the parenthesized list as a constant_pattern over a tuple_expression, which the constant-pattern reading does not take, and the member access inside it reads only its namespace prefix as a receiver. A type pattern in a positional pattern is C# 9 (spec §11.2.6, §11.2.5); a declaration pattern there (x is (Models.Order o, _)) is parsed as a positional subpattern and keeps its edge. A false negative 748 did not touch.

Moved from issue 750 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A lost true edge hides a dependency from every consumer that checks its architecture with the readers: a false green.

## Acceptance
[test] x is (Order, _), x is (Models.Order, _), x is (App.Models.Order, 1) and a switch arm (Models.Order, _) => give the edge to Order, in catalogue cases red at v1.1.0 and green after; a name in the same place that the file declares as a value gives none, and every existing answer and edge stays as it is · by: npm run check

## Evidence

