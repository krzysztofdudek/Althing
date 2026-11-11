# 552 · C#: a raw > in a Condition that is written before the Include of a ProjectReference (or before the …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1050-oiis
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp-reach.mts
**Repo:** Runes
**Found by:** rev-506b-fable
**Where:** the review of 489, 506
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
C#: a raw > in a Condition that is written before the Include of a ProjectReference (or before the Project of an Import) ends the tag early for the reader, so the Include is not seen and the reference or import is not followed: a project the caller reaches is answered unreachable where the &gt; spelling, or the attributes in the other order, give reachable (a probe on the built reader, the same on release/1.1.0). The same spelling 612f7de fixed for Compile items and their groups (the ATTRS text at csharp-reach.mts:71) is not applied to the ProjectReference, Reference, PackageReference, InternalsVisibleTo, AssemblyAttribute and Import regexes, which still read up to the first >. Rare input; pre-existing, not a regression of 506 or 489.

## Why


## Acceptance


- [test] A ProjectReference whose Condition holds a raw > before its Include, and an Import whose Condition holds a raw > before its Project, are followed: a project the caller reaches is answered reachable, as with the &gt; spelling or the attributes in the other order, red before and green after · by: npm run check
- [test] The same holds for Reference, PackageReference, InternalsVisibleTo and AssemblyAttribute items with a raw > in a Condition written before their Include, red before and green after · by: npm run check

## Evidence

