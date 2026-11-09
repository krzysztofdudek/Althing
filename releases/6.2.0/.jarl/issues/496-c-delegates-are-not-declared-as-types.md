# 496 · C#: delegates are not declared as types

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-oqnx
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-delegate
**Where:** src/relations/extractors/csharp.mts:120

## What
Claim: TYPE_DECLARATION_TYPES leaves out delegate_declaration, so a delegate type used in another node gives no edge, and a delegate of the enclosing namespace does not hide an imported class of the same name (a false edge). A delegate is a type (spec 21). Pre-existing in v1.0.0.

probes/csharp p07 (silence, expected Bus.cs:4->core), p33 (silence, expected Use.cs:4->core), p08 (Bus.cs:4->core, expected silence); same on v1.0.0

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Publish a key for delegate_declaration in declarations, top-level and nested, as for a class.

## Evidence

