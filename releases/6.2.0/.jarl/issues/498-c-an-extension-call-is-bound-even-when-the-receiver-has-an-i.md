# 498 · C#: an extension call is bound even when the receiver has an instance method of that name

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-ddgl
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/resolver.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-extinstm
**Where:** src/relations/extractors/csharp.mts:938
**After:** 494
**Branch:** jarl/494-csharp-base-classes
**Worker:** w-494-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 12:57

## What
Claim: extensionCall drops a call only when the file itself declares a method of that name. An instance method of the receiver's type in another file, an interface method or an inherited method is unseen, so an in-scope extension of the same name in another node gets a false edge. C# considers extension methods only when no instance method applies (spec 12.8.10.3). Pre-existing in v1.0.0.

probes/csharp p11 (Checkout.cs:5->ext), p29 (Handler.cs:5->outbox), p41 (OrderRepo.cs:3->docs), each expected without that edge; same on v1.0.0

## Why


## Acceptance
- [test] An extension-shaped call whose receiver's type is written in the file (a parameter, field, property or local of a declared type, or this) gives no edge to an extension method when that type, a base class or an interface of it in the repository, or another part of it, declares an instance method of that name (C# spec §12.8.10.3: extension methods are considered only when no applicable instance method exists), with the audit's probes p11 (Checkout.cs:5), p29 (Handler.cs:5) and p41 (OrderRepo.cs:3) as catalogue cases, each without that edge, red before and green after · by: npm run check
- [test] When that type, its repository bases and interfaces and its other parts declare no method of that name, the extension call keeps its edge, with a case · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

### Notes

Ruling outside-base-members-stay-a-known-limit (by owner): A member inherited from a base class outside the repository (ASP.NET Core's ControllerBase.User and the like) keeps today's reading in Runes 1.1.0: a same-named repository type still gets the edge, and the changelog and docs state it as a known limit. The lines of 493, 494 and 498 that ask for the outside-base case are dropped; their in-repository lines stand. · the owner's words: "Krzysztof, 2026-11-11 (translated from Polish): "3""

