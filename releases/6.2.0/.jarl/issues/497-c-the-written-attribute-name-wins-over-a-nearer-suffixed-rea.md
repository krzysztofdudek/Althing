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

## Changelog
- C#: `[Foo]` binds the reading that is an attribute class. A plain class `Foo` beside `FooAttribute` no longer takes the edge, a nearer `FooAttribute` wins over a `Foo` from a using, and a domain class named like a framework attribute (`Route` beside `[Route]`) gives no edge.

## Evidence

### Proof

- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus, and node scripts/corpus.mjs verify --tier all --only jellyfin,eShop, on the branch tip 68bf674 · **saw:** corpus gate: passed (25 repositories, CleanArchitecture 452 edges, 0 added, 0 removed; go and dotnet oracles SKIPPED, not installed). corpus verify: passed (jellyfin 32640 edges and eShop 2017 edges, 0 added, 0 removed) after the jellyfin golden was regenerated with 212 explained lines: 15 added and 176 removed by this branch, 21 added that the release branch already gave.
- **ran (line 7564f62a293b):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-attribute-written-name-no-attribute-class-edge DIFFERS (Dto.cs:5 -> domain) and csharp-attribute-suffixed-nearer-than-written-edge DIFFERS (Controller.cs:4 -> lib). After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. Both pass (val, attrs).
- **ran (line bf29cd7f2324):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-attribute-plain-class-of-that-name-silence DIFFERS (RoutesController.cs:5 -> domain). After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. The case passes in silence.
- **ran (line d328358072fb):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-attribute-suffixed-outside-base-edge DIFFERS and csharp-attribute-written-outside-base-silence DIFFERS; csharp-attribute-written-with-suffix-outside-base-edge passed already. After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. All three pass.
- **ran (line 7e975907cc22):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-attribute-both-readings-attribute-classes-silence DIFFERS (an edge). After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. The case passes in silence.

### Notes

Assumed: where the written name has no suffix and its class only may be an attribute class (a base outside the repository), and the suffixed reading binds a class of the repository that is no attribute class, the attribute gives no edge. The line names only the case where the suffixed reading binds nothing; this one is treated the same way.

Assumed: where both readings bind classes that only may be attribute classes, the suffixed one is taken, as the line's wording for the suffixed reading says. A struct, an enum or a delegate reads as no attribute class when it lists no base; an interface never is one.

Assumed: where one of the two readings ends at a file-local type of the referencing file, which no key names, the readings stay one ordered group as before this change.

