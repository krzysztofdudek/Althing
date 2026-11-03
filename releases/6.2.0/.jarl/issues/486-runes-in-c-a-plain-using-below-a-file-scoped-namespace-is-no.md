# 486 · Runes: in C#, a plain using below a file-scoped namespace is not read for an alias target in a nested block

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp, 1.1.0
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**Found by:** rev-runes-476b-fable
**Where:** Review of 476 round 1 (2026-11-03): namespace A; using X; namespace B { using O = Order; } leaves the directive line and the uses of O silent, while a plain Order there binds X.Order; the file-scoped namespace is no NsFrame, so outerList skips it. Same on release/1.1.0 before 476

## What
An alias target in a block nested under a file-scoped namespace does not see the plain usings written below that file-scoped namespace.

## Why
A lost edge for a common layout since C# 10.

## Acceptance
- The case gives the alias its edge to X.Order on its directive line and its uses, red before and green after
- docs/api.md says that target lost nearest, that prefixDecls and OuterUsings.prefixes carry the global:: form, and drops UsingScope.prefixes if nothing reads it (review findings 2 to 4 of 476)

## Evidence

