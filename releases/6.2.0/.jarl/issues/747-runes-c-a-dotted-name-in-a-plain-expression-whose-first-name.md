# 747 · Runes, C#: a dotted name in a plain expression whose first name the file also declares as a value o…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261115T0559-xlyv
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-696-opus
**Where:** the review of 696, 701, 708, 744

## What
Runes, C#: a dotted name in a plain expression whose first name the file also declares as a value of that name's type (C#'s Color Color rule: var Status = Factory.Make(); return Status == Status.Active;, or Status = Status.Done; beside a property public Status Status { get; set; }) gives no edge to the type Status at 8d31e57, 7693a11 and f396769, where C# binds the static member through the type; with a var local or an implicitly typed lambda parameter the file has no edge to Status at all. 744 made the pattern forms read the type; the member-access reading of expressions still takes any declared value as no type.

## Why


## Acceptance


## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-csharp-second-review-findings

