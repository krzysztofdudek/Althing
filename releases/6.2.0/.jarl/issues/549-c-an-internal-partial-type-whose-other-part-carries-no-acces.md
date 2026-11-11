# 549 · C#: an internal partial type whose other part carries no access modifier (internal partial class Or…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1034-bgpw
**Tags:** 
**Files:** 
**Repo:** Runes
**Found by:** rev-506-fable
**Where:** the review of 489, 506
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
C#: an internal partial type whose other part carries no access modifier (internal partial class Order in one file, partial class Order in another of the same project) keeps the unmarked part as a candidate, so a caller in another project gets silence where the compiler binds the public type of a referenced project; the same silence as on release/1.1.0, so no regression (a probe case run on both trees).

## Why


## Acceptance


[test] A catalogue case under reference/relations/csharp/ with internal partial class Order in one file and partial class Order with no access modifier in another file of the same project, and a caller in another project that references a project with a public Order: the caller gets the edge to that public Order, not silence, red before and green after · by: npm run check

## Changelog
- C#: a `partial` type part that carries no access modifier is internal where another part of the same project says so (`partial class Order` beside `internal partial class Order`), so a caller in another project binds the public type of that name it references. Needs the reference graph (`reach`).

## Evidence

### Proof

- **ran (line 680ddbeef4f0):** node --test --test-name-pattern=csharp-internal-partial-type-unmarked test/relations/extractors/csharp-name-resolution-matrix.test.mjs, on release/1.1.0 at 44a06cc with the new case, then on a965a49 · **saw:** before: fail, expected edge src/Web/Api.cs:3->Core not emitted (got none); after: pass

### Notes

Assumed: the fix is in the resolver and needs no rev. A declaration of a type that its own file does not mark internal is read as internal where another file of the same compilation (reach answers same) marks that type or a type around it. An extension method's key keeps its own file's word, because one key names every method of that name in a namespace.

