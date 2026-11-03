# 492 · C#: a bare name never reads the nested types of its enclosing types

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 1.1.0, must-for-1.1.0, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-nestencl
**Where:** src/relations/extractors/csharp.mts:1801
**Branch:** jarl/492-csharp-member-and-arity-lookup
**Worker:** w-runes-492-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-492
**Since:** 2026-11-03 04:45

## What
Claim: Inside a type that nests Command, Result or Status, the bare name binds a same-named type of an enclosing namespace, the global namespace, an import or a global alias in another node. C# reads the nested types of each enclosing type, from every partial part, first (spec 7.6.1, 12.8.4). Pre-existing in v1.0.0.

probes/csharp p01 (CreateOrder.cs:4->shared, expected silence), p02 (GetOrder.cs:5->shared), p19 (Order.cs:4->codes), p31 (Importer.Run.cs:3->grid), p38 (Handler.cs:4->lib); same edges on v1.0.0; csharp-probe-output-5227538.txt

## Why


## Acceptance
- A bare name inside a type reads the nested types of its enclosing types, innermost first, before any namespace reading (C# 7.6.1), with the audit's probes as catalogue cases (a nested Command, Result or Status beside a same-named type elsewhere), red before and green after
- The C# matrix, csharp-parity and candidate-parity tests are unchanged apart from the new cases, and the corpus goldens change only by explained lines

## Evidence

