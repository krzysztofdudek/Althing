# 500 · C#: using static imports neither nested types nor extension methods for references

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-awol
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-usingsta
**Where:** src/relations/extractors/csharp.mts:1600

## What
Claim: Only the using static target gives an edge. The nested types and extension methods it imports (spec 14.5.4) are lost, and inside a namespace body a farther global type of the same name binds instead (a false edge). Pre-existing in v1.0.0.

probes/csharp p12 (Draw.cs:4 missing), p13 (A.cs:4 missing), p35 (Draw.cs:4->legacy, expected core); same on v1.0.0

## Why


## Acceptance
- [test] A using static T directive makes T's nested types visible to a simple name, at the binding level of the body that holds the directive (C# spec §14.5.4), with the audit's probes p12 (Draw.cs:4 -> core) and p35 (Draw.cs:4 -> core, not legacy) as catalogue cases, red before and green after · by: npm run check
- [test] A using static T directive makes T's extension methods callable in extension form, with p13 (A.cs:4 -> ext) as a catalogue case, red before and green after · by: npm run check
- [test] A using static of the compilation unit, of a namespace body and a project-wide global using static each import at their own level, with a case each · by: npm run check
- [test] A nested type a using static imports and a type of the same name a plain using of the same level imports are ambiguous (CS0104), and the reference gives no edge, with a case · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

