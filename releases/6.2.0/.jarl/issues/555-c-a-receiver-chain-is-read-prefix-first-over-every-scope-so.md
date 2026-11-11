# 555 · C#: a receiver chain is read prefix first over every scope, so a type of the same name as a nearer …

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1119-ccnx
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-499b-fable
**Where:** the review of 496, 499, 501

## What
C#: a receiver chain is read prefix first over every scope, so a type of the same name as a nearer namespace takes the edge (in namespace App.Web, Data.Row.Parse() or o is Data.Row beside a namespace App.Data and a global class Data gives the edge to the class Data, where C# binds the namespace App.Data first); the plain type reading of Data.Row binds it right. Present on the base release/1.1.0, src/relations/extractors/csharp.mts:2118.

## Why


## Acceptance


## Evidence

