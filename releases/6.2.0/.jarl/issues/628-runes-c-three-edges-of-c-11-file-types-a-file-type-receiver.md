# 628 · Runes, C#: three edges of C# 11 file types: a file-type receiver's instance methods are never checked, a file interface inherits nothing from its base interfaces, and a dotted name through a file type of the same file binds nothing

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1756-mfue
**Tags:** runes, csharp
**Files:** 
**Repo:** Runes
**After:** 493
**Found by:** jarl
**Where:** rev-494d-opus, the C# package after its takeover (csharp.mts:2692, :2754, :849, :2477; csharp-resolve.mts:98-104)
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What


## Why
file class Rush : Order with r.Validate() keeps a false extension edge though Order's own Validate takes it; file interface IDerived : IBase reads the namespace's Options instead of IBase.Options; Worker.Options through file class Worker : WorkerBase binds nothing. All existed before this package; docs/api.md:89 says a file type's bases are read.

## Acceptance
[test] Each of the three shapes binds as the C# rules say (Order's own Validate, IBase.Options, WorkerBase.Options), a catalogue case each, red before and green after · by: npm run check

## Evidence

