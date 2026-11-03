# 494 · C#: nested types of base classes are never found

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-basenest
**Where:** src/relations/extractors/csharp.mts:1756

## What
Claim: No lookup reads the base list, so Options inside a class derived from a base that nests Options binds App.Web.Options of another node, and Derived.Options finds nothing. C# reads the nested types of base classes as members (spec 7.6.1). Pre-existing in v1.0.0.

probes/csharp p03 (MyHandler.cs:4->cfg, expected core), p32 (Use.cs:3->core missing); same on v1.0.0

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Record each type's base list in the declarations; when a bare or dotted name runs inside a derived type (or through it), try `<Base>+<Name>` for each base reached, before the namespace readings, and silence the group when a base lies outside the repository.

## Evidence

