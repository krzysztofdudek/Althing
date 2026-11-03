# 485 · Runes: in C#, a compilation-unit using beside a global type of the same simple name binds the imported type, where C# reads the global namespace's members first

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 476
**Found by:** rev-runes-476-fable
**Where:** Review of 476 (2026-11-03): C# specification 7.8.1

## What
With using Lib; at the top of a file and a type Order declared in the global namespace, a use of Order binds Lib.Order; C# finds the global namespace's own member Order before it looks at the using directives of the compilation unit.

## Why
A false edge to the imported type and a lost edge to the real one.

## Acceptance
The case gives the edge to the global type, red before and green after, with a control where no global Order exists

## Evidence

