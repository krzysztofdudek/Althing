# 494 · C#: nested types of base classes are never found

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-vwgr
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/resolver.mts, Runes/src/relations/symbol-table.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-basenest
**Where:** src/relations/extractors/csharp.mts:1756
**Branch:** jarl/494-csharp-base-classes
**Worker:** w-494-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 12:57

## What
Claim: No lookup reads the base list, so Options inside a class derived from a base that nests Options binds App.Web.Options of another node, and Derived.Options finds nothing. C# reads the nested types of base classes as members (spec 7.6.1). Pre-existing in v1.0.0.

probes/csharp p03 (MyHandler.cs:4->cfg, expected core), p32 (Use.cs:3->core missing); same on v1.0.0

## Why


## Acceptance
- [test] The base list each type declares, from every part of a partial type, is recorded with the file's extraction, and a test reads it for a class, a partial class and a nested class · by: npm run check
- [test] A simple name inside a class whose base class is declared in the repository reads the nested types of that base, and of its bases to any depth in the repository, after the class's own nested types and before any namespace, alias or using (C# spec §7.6.1), with the audit's probe p03 as a catalogue case (MyHandler.cs:4 -> core, not cfg), red before and green after · by: npm run check
- [test] A dotted name through a derived type (Derived.Options) binds the nested type its base declares, with p32 as a catalogue case (Use.cs:3 -> core), red before and green after · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- C#: a name inside a class reads the nested types of its base classes, so `Options` in `class MyHandler : HandlerBase` names `HandlerBase.Options` before a namespace's `Options`, and `Derived.Options` names the type the base of `Derived` nests. A consumer's graph can show an edge move to the base class's node. A base class outside the repository is not followed.

## Evidence

### Proof

- **ran (line 87f6fd00893a):** npm run check, on the branch tip 68bf674 · **saw:** exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. The new unit tests read the recorded base list for a class, a partial class in three files and a nested class (csharp-base-classes.test.mjs). No run before the change: the record did not exist.
- **ran (line e9989e38e146):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-base-class-nested-type-edge DIFFERS (MyHandler.cs:4 -> cfg) and csharp-base-class-nested-type-deep-partial-edge DIFFERS. After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. Both cases pass, with the own-nested-first and interface cases.
- **ran (line e5afffcbcdf5):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-base-class-nested-type-through-derived-name-edge DIFFERS (Use.cs:3 gives nothing). After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. The case passes (Use.cs:3 -> core).
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus, and node scripts/corpus.mjs verify --tier all --only jellyfin,eShop, on the branch tip 68bf674 · **saw:** corpus gate: passed (25 repositories, CleanArchitecture 452 edges, 0 added, 0 removed; go and dotnet oracles SKIPPED, not installed). corpus verify: passed (jellyfin 32640 edges and eShop 2017 edges, 0 added, 0 removed) after the jellyfin golden was regenerated with 212 explained lines: 15 added and 176 removed by this branch, 21 added that the release branch already gave.

### Notes

Ruling outside-base-members-stay-a-known-limit (by owner): A member inherited from a base class outside the repository (ASP.NET Core's ControllerBase.User and the like) keeps today's reading in Runes 1.1.0: a same-named repository type still gets the edge, and the changelog and docs state it as a known limit. The lines of 493, 494 and 498 that ask for the outside-base case are dropped; their in-repository lines stand. · the owner's words: "Krzysztof, 2026-11-11 (translated from Polish): "3""

Assumed: a base is read with the usings and aliases of the file that declares it, because a declaration is extracted without the project's scope. A base class that file reaches only through a project-wide global using of another file, an MSBuild Using item or a project-wide alias is not followed, so the reading stays what it was. Following it needs the project scope at declaration time, which is a change in both consumers.

Assumed: the record travels as declared keys (base:<type key>, a tab, a JSON value; interface:<type key>), listed by a new SymbolTable.valuesOf, so a consumer that passes every declared key to declare() needs no change. A consumer that counts or lists declared keys now sees these markers too, as it sees internal:<key> today.

