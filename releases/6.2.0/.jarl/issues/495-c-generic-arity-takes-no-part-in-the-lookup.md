# 495 · C#: generic arity takes no part in the lookup

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 1.1.0, must-for-1.1.0, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-arityign
**Where:** src/relations/extractors/csharp.mts:429
**Branch:** jarl/492-csharp-member-and-arity-lookup
**Worker:** w-runes-492-opus
**Worktree:** /home/krzysiek/.jarl-wt/Runes-492
**Since:** 2026-11-03 04:45

## What
Claim: Keys carry no arity, so a nearer App.Result binds Result<int>, a nearer App.Envelope<T> binds a bare Envelope, and Result and Result<T> in two nodes of one namespace silence both. C# matches the arity (spec 7.6.1). Pre-existing, except the alias-target form (using R = Result<int>), which v1.0.0 left silent and 5227538 binds to the non-generic type.

probes/csharp p05 (Api.cs:4->core, expected lib), p06 (Api.cs:4->core, expected lib), p17 (silence, expected a and b), p40 (Api.cs:2->core at 5227538, silence at v1.0.0, expected gen)

## Why


## Acceptance
- Generic arity takes part in C# lookup: Result binds no Result<T>, Result<int> binds no Result, and Result and Result<T> declared in two nodes each keep their edge, including through an alias target, with the audit's probes as catalogue cases, red before and green after
- The C# matrix and parity tests are unchanged apart from the new cases, and the corpus goldens change only by explained lines

## Evidence

