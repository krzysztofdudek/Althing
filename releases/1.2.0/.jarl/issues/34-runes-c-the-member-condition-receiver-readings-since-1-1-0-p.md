# 34 · Runes, C#: the member condition (receiver readings since 1.1.0, pattern names from issue 4) reads a…

**Status:** deferred
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261117T1658-ohpl
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-4-opus
**Where:** the review of 4

## What
Runes, C#: the member condition (receiver readings since 1.1.0, pattern names from issue 4) reads an internal or private protected member of a base class declared in another project as one the derived type sees, where C# does not see it across assemblies without InternalsVisibleTo and binds a type of that name instead; so Order.Make() beside an internal static field Order of a base in project core, and case Order: or Order => beside an internal const Order there, lose their true edge to an imported type Order

## Why


## Acceptance


## Evidence

### Notes

Deferred: To the next Runes version: the member condition's reading of an internal or private protected base member across projects, which the receiver reading has had since v1.1.0; 4 extends it to pattern names, losing an edge only for an internal constant of a base in another project without InternalsVisibleTo (ruling runes-1-2-0-cut-for-new-findings; the loss is named in 4's changelog entry)

