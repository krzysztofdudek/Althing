# 496 · C#: delegates are not declared as types

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-oqnx
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-delegate
**Where:** src/relations/extractors/csharp.mts:120

## What
Claim: TYPE_DECLARATION_TYPES leaves out delegate_declaration, so a delegate type used in another node gives no edge, and a delegate of the enclosing namespace does not hide an imported class of the same name (a false edge). A delegate is a type (spec 21). Pre-existing in v1.0.0.

probes/csharp p07 (silence, expected Bus.cs:4->core), p33 (silence, expected Use.cs:4->core), p08 (Bus.cs:4->core, expected silence); same on v1.0.0

## Why


## Acceptance
- [test] A delegate declaration publishes a type key as a class does, top-level and nested (Outer+Handler), with its arity when generic, with the audit's probes p07 (Bus.cs:4 -> core) and p33 (Use.cs:4 -> core) as catalogue cases, red before and green after (C# spec §21) · by: npm run check
- [test] A delegate of an enclosing namespace hides an imported class of the same name, with p08 as a catalogue case (silence), red before and green after · by: npm run check
- [test] A file-local delegate is not published, as a file-local class is not, with a case · by: npm run check

## Evidence

