# 494 · C#: nested types of base classes are never found

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-vwgr
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/resolver.mts, Runes/src/relations/symbol-table.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-basenest
**Where:** src/relations/extractors/csharp.mts:1756

## What
Claim: No lookup reads the base list, so Options inside a class derived from a base that nests Options binds App.Web.Options of another node, and Derived.Options finds nothing. C# reads the nested types of base classes as members (spec 7.6.1). Pre-existing in v1.0.0.

probes/csharp p03 (MyHandler.cs:4->cfg, expected core), p32 (Use.cs:3->core missing); same on v1.0.0

## Why


## Acceptance
- [test] The base list each type declares, from every part of a partial type, is recorded with the file's extraction, and a test reads it for a class, a partial class and a nested class · by: npm run check
- [test] A simple name inside a class whose base class is declared in the repository reads the nested types of that base, and of its bases to any depth in the repository, after the class's own nested types and before any namespace, alias or using (C# spec §7.6.1), with the audit's probe p03 as a catalogue case (MyHandler.cs:4 -> core, not cfg), red before and green after · by: npm run check
- [test] A dotted name through a derived type (Derived.Options) binds the nested type its base declares, with p32 as a catalogue case (Use.cs:3 -> core), red before and green after · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

