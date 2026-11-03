# 492 · C#: a bare name never reads the nested types of its enclosing types

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-nestencl
**Where:** src/relations/extractors/csharp.mts:1801

## What
Claim: Inside a type that nests Command, Result or Status, the bare name binds a same-named type of an enclosing namespace, the global namespace, an import or a global alias in another node. C# reads the nested types of each enclosing type, from every partial part, first (spec 7.6.1, 12.8.4). Pre-existing in v1.0.0.

probes/csharp p01 (CreateOrder.cs:4->shared, expected silence), p02 (GetOrder.cs:5->shared), p19 (Order.cs:4->codes), p31 (Importer.Run.cs:3->grid), p38 (Handler.cs:4->lib); same edges on v1.0.0; csharp-probe-output-5227538.txt

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Carry the enclosing type chain (CsScope.chain) on plain, receiver and attribute descriptors and put the nested readings `<ns>.<Outer>+<Name>`, innermost type first, ahead of the namespace readings; a hit in any of them stops the group.

## Evidence

