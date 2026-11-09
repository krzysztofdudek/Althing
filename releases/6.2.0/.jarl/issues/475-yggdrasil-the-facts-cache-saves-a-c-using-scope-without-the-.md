# 475 · Yggdrasil: the facts cache saves a C# using scope without the alias declarations Runes 1.1.0 adds, so a reloaded entry may fail in the assembly step

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0017-lyln
**Tags:** yggdrasil, runes, csharp
**Files:** 
**Repo:** ../../../Yggdrasil
**Found by:** w-runes-469-opus
**Where:** Yggdrasil main, source/cli/src/relations/facts-cache.ts (read by the 469 worker on 2026-11-03); Runes release/1.1.0 merge 86bd33b (issue 295) adds aliasDecls to the C# using scope

## What
The facts cache writes a C# file's using scope field by field. The field Runes 1.1.0 adds for block-scoped aliases is not among them, so an entry written and read back lacks it, and the assembly step that reads it would fail.

## Why
Adopting Runes 1.1.0 would crash yg check on the second run of any C# repository with a warm cache.

## Acceptance
- A test writes a C# file's facts through the cache, reads them back and gets the same edges as a cold run, red before the fix on Runes 1.1.0 and green after
- The cache key or the stored shape changes so an entry written by the old shape is never read as the new one

## Evidence

Belongs with the adoption of Runes 1.1.0 in Yggdrasil (142): the red run needs Yggdrasil on Runes 1.1.0, so the two go on one branch

From the review of 476 (rev-runes-476-fable, 2026-11-03): the facts cache must also store the using scope's prefixDecls, which 476 adds; and Grain's serializer spreads the scope, so prefixDecls survives there, but the aliasDecls Map will not when Grain adopts 1.1.0

