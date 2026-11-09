# 498 · C#: an extension call is bound even when the receiver has an instance method of that name

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-ddgl
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-extinstm
**Where:** src/relations/extractors/csharp.mts:938

## What
Claim: extensionCall drops a call only when the file itself declares a method of that name. An instance method of the receiver's type in another file, an interface method or an inherited method is unseen, so an in-scope extension of the same name in another node gets a false edge. C# considers extension methods only when no instance method applies (spec 12.8.10.3). Pre-existing in v1.0.0.

probes/csharp p11 (Checkout.cs:5->ext), p29 (Handler.cs:5->outbox), p41 (OrderRepo.cs:3->docs), each expected without that edge; same on v1.0.0

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Publish the ordinary method names each type declares and drop the extension reading when any repository type declares an instance method of that name, or when the receiver's declared type (a field, parameter or local written in the file) declares one.

## Evidence

