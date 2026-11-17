# 4 · Runes, C#: a simple name in a constant pattern inside a type that lists a base is read as a type wh…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1204-odef
**Tags:** csharp, runes
**Files:** 
**Repo:** Runes
**Found by:** rev-743-opus
**Where:** the review of 741, 743, 747, 750

## What
Runes, C#: a simple name in a constant pattern inside a type that lists a base is read as a type where C# binds a constant the base class declares in another file (class D : Fields, Fields declaring const string Order, gives D's case Order:, Order => and, after 750, (Order, _) an edge to an imported type App.Models.Order, at v1.1.0 for the lone forms and at 619bccf for the tuple too); the receiver reading carries the member condition for this, the pattern readings do not

## Why


A false edge to an imported type is a false red for every consumer that checks dependencies.

## Acceptance


[test] Inside a type that lists a base declared in another file of the repository, case Order:, Order => and (Order, _) give no edge to a type Order where that base declares a constant or field Order, as the receiver reading already does for members, and keep the edge where no base of the type declares the name; catalogue cases red before and green after; every existing answer and edge stays as it is · by: npm run check

## Evidence

