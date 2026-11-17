# 747 · Runes, C#: a dotted name whose first name the file also declares as a value of that type gives no edge (the Color Color rule in expressions)

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1032-grqq
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**Found by:** rev-696-opus
**Where:** the review of 696, 701, 708, 744

## What
Runes, C#: a dotted name in a plain expression whose first name the file also declares as a value of that name's type (C#'s Color Color rule: var Status = Factory.Make(); return Status == Status.Active;, or Status = Status.Done; beside a property public Status Status { get; set; }) gives no edge to the type Status at 8d31e57, 7693a11 and f396769, where C# binds the static member through the type; with a var local or an implicitly typed lambda parameter the file has no edge to Status at all. 744 made the pattern forms read the type; the member-access reading of expressions still takes any declared value as no type.

Moved from issue 747 of the 6.2.0 loop, where it stays deferred: the owner's answer to a-41 and a-42 there sends the items moved out of Runes 1.1.0 and the reader gaps 752 to 765 to the next Runes version.

## Why
A lost true edge hides a dependency from every consumer that checks its architecture with the readers: a false green.

## Acceptance
[test] Status == Status.Active and Status = Status.Done, where the file also declares a value named Status of type Status (a property, a field, a var local, an implicitly typed lambda parameter), give the edge to the type Status, as C# binds the static member through the type, in catalogue cases red at v1.1.0 and green after; a value named Status whose written type is not Status still gives no edge, and every existing answer and edge stays as it is · by: npm run check

## Evidence

