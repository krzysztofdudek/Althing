# 500 · C#: using static imports neither nested types nor extension methods for references

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-usingsta
**Where:** src/relations/extractors/csharp.mts:1600

## What
Claim: Only the using static target gives an edge. The nested types and extension methods it imports (spec 14.5.4) are lost, and inside a namespace body a farther global type of the same name binds instead (a false edge). Pre-existing in v1.0.0.

probes/csharp p12 (Draw.cs:4 missing), p13 (A.cs:4 missing), p35 (Draw.cs:4->legacy, expected core); same on v1.0.0

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Put the using static targets of each body into levelsAt and the compilation-unit set, as nestedOnly members `<T>.<Name>`, and their extension keys into pushExtension.

## Evidence

