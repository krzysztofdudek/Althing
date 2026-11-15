# 750 · Runes, C#: a type in a positional pattern beside a discard or a constant (x is (Order, _), x is (Mo…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261115T0629-jkbd
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-748-opus
**Where:** the review of 748

## What
Runes, C#: a type in a positional pattern beside a discard or a constant (x is (Order, _), x is (Models.Order, _), x is (App.Models.Order, 1), a switch arm (Models.Order, _) =>) gives no edge, at c21ceca and at d97e722 alike: the grammar reads the parenthesized list as a constant_pattern over a tuple_expression, which the constant-pattern reading does not take, and the member access inside it reads only its namespace prefix as a receiver. A type pattern in a positional pattern is C# 9 (spec §11.2.6, §11.2.5); a declaration pattern there (x is (Models.Order o, _)) is parsed as a positional subpattern and keeps its edge. A false negative 748 did not touch.

## Why


## Acceptance


## Evidence

### Notes

Deferred: after Runes 1.1.0: a silence older than this release (a type in a positional pattern gives no edge), ruling runes-csharp-second-review-findings

