# 497 · C#: the written attribute name wins over a nearer suffixed reading, and a non-attribute class counts

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-irqq
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/resolver.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-attrread
**Where:** src/relations/extractors/csharp.mts:1827
**After:** 494
**Branch:** jarl/494-csharp-base-classes
**Worker:** w-494-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 12:57

## What
Claim: pushAttribute merges every reading of the written name before every reading of the Attribute-suffixed name, and any class binds. C# resolves both and takes the one that is an attribute class (spec 23.3). An entity Required beside RequiredAttribute gives the edge to the entity; a nearer App.Web.AuditAttribute loses to a plain Lib.Audit from a using. Pre-existing in v1.0.0.

probes/csharp p09 (Dto.cs:5->domain, expected val), p10 (Controller.cs:4->lib, expected attrs); same on v1.0.0

## Why


## Acceptance
- [test] The written name and the Attribute-suffixed name of an attribute are each looked up on their own, nearest scope first, and the result is the reading that binds an attribute class, a class whose base chain followed through the repository reaches System.Attribute (C# spec §23.3), with the audit's probes p09 (Dto.cs:5 -> val) and p10 (Controller.cs:4 -> attrs) as catalogue cases, red before and green after · by: npm run check
- [test] A class whose whole base chain lies in the repository and never reaches System.Attribute is no attribute class and gives no edge as an attribute, with the sceptic's probe s03 as a catalogue case (a domain Route beside ASP.NET's [Route]: silence), red before and green after · by: npm run check
- [test] A class whose base chain leaves the repository through a base other than System.Attribute may be an attribute class: as the Attribute-suffixed reading it is taken when the written reading binds no attribute class of the repository ([RequiredIf] for RequiredIfAttribute : ValidationAttribute), and as the written reading of a name without the suffix it gives no edge when the suffixed reading binds nothing in the repository, with a case each · by: npm run check
- [test] When both readings bind attribute classes (a compile error, CS1614) the attribute gives no edge, with a case · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Evidence

