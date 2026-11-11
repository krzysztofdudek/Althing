# 555 · C#: a receiver chain is read prefix first over every scope, so a type of the same name as a nearer …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1119-ccnx
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** rev-499b-fable
**Where:** the review of 496, 499, 501
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
C#: a receiver chain is read prefix first over every scope, so a type of the same name as a nearer namespace takes the edge (in namespace App.Web, Data.Row.Parse() or o is Data.Row beside a namespace App.Data and a global class Data gives the edge to the class Data, where C# binds the namespace App.Data first); the plain type reading of Data.Row binds it right. Present on the base release/1.1.0, src/relations/extractors/csharp.mts:2118.

## Why


## Acceptance


[test] A catalogue case in namespace App.Web with a namespace App.Data and a global class Data: Data.Row.Parse() and o is Data.Row give the edge through the nearer namespace App.Data, not to the class Data, as the plain type reading of Data.Row does, red before and green after · by: npm run check

## Evidence

