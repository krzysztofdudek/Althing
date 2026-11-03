# 495 · C#: generic arity takes no part in the lookup

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-arityign
**Where:** src/relations/extractors/csharp.mts:429

## What
Claim: Keys carry no arity, so a nearer App.Result binds Result<int>, a nearer App.Envelope<T> binds a bare Envelope, and Result and Result<T> in two nodes of one namespace silence both. C# matches the arity (spec 7.6.1). Pre-existing, except the alias-target form (using R = Result<int>), which v1.0.0 left silent and 5227538 binds to the non-generic type.

probes/csharp p05 (Api.cs:4->core, expected lib), p06 (Api.cs:4->core, expected lib), p17 (silence, expected a and b), p40 (Api.cs:2->core at 5227538, silence at v1.0.0, expected gen)

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Publish the arity with each type key (for example `App.Result`1`, the .NET metadata name) and carry the written arity on every reference, so a reading binds only a type with the same number of type parameters.

## Evidence

