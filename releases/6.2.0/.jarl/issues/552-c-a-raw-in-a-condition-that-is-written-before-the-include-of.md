# 552 · C#: a raw > in a Condition that is written before the Include of a ProjectReference (or before the …

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1050-oiis
**Tags:** 
**Files:** Runes/src/relations/extractors/csharp-reach.mts
**Repo:** Runes
**Found by:** rev-506b-fable
**Where:** the review of 489, 506
**Branch:** jarl/549-csharp-rest
**Worker:** w-549-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:07

## What
C#: a raw > in a Condition that is written before the Include of a ProjectReference (or before the Project of an Import) ends the tag early for the reader, so the Include is not seen and the reference or import is not followed: a project the caller reaches is answered unreachable where the &gt; spelling, or the attributes in the other order, give reachable (a probe on the built reader, the same on release/1.1.0). The same spelling 612f7de fixed for Compile items and their groups (the ATTRS text at csharp-reach.mts:71) is not applied to the ProjectReference, Reference, PackageReference, InternalsVisibleTo, AssemblyAttribute and Import regexes, which still read up to the first >. Rare input; pre-existing, not a regression of 506 or 489.

## Why


## Acceptance


- [test] A ProjectReference whose Condition holds a raw > before its Include, and an Import whose Condition holds a raw > before its Project, are followed: a project the caller reaches is answered reachable, as with the &gt; spelling or the attributes in the other order, red before and green after · by: npm run check
- [test] The same holds for Reference, PackageReference, InternalsVisibleTo and AssemblyAttribute items with a raw > in a Condition written before their Include, red before and green after · by: npm run check

## Changelog
- C#: a `Reference`, `PackageReference`, `InternalsVisibleTo`, `AssemblyAttribute` or `Import` whose `Condition` holds a raw `>` before its `Include` or `Project` is read whole, so the project it names is reachable.

## Evidence

### Proof

- **ran (line 62a2168862d3):** node --test --test-name-pattern='condition comes first' test/relations/csharp-reach.test.mjs, on a965a49 with the new tests, then on 38615a3 · **saw:** before: fail on the Import whose Condition holds a raw > before its Project (expected 'unreachable' to be 'reachable'); a probe on the same build answered reachable for a ProjectReference in that form, so that half already held on release/1.1.0; after: pass
- **ran (line 0d2b825a819d):** node --test --test-name-pattern='condition comes first' test/relations/csharp-reach.test.mjs and --test-name-pattern=csharp-reference-condition-raw-greater-than-edge on the matrix, on a965a49 with the new tests, then on 38615a3 · **saw:** before: fail, Reference with the Condition first answered unreachable, and the catalogue case gave no edge; after: pass, Reference, Reference with a HintPath, PackageReference, InternalsVisibleTo and AssemblyAttribute all read

### Notes

Assumed: a ProjectReference with a raw > before its Include was already followed on release/1.1.0 (a probe answered reachable), so line 1 was red only for the Import. The proof is two unit tests of the reader and one catalogue case for a Reference; an Import has no catalogue case because the case runner takes no .props file.

