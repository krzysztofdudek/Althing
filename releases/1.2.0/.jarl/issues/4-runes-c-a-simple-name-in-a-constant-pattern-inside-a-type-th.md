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


## Acceptance


## Evidence

