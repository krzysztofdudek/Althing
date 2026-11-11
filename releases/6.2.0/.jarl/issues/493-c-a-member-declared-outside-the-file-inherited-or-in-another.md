# 493 · C#: a member declared outside the file (inherited, or in another partial part) is read as a type receiver

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261103T0440-hkbg
**Tags:** 1.1.1, must-for-1.1.0, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts, Runes/src/relations/resolver.mts, Runes/src/relations/symbol-table.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-inhermem
**Where:** src/relations/extractors/csharp.mts:1412
**Branch:** jarl/494-csharp-base-classes
**After:** 494
**Worker:** w-494-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 12:57

## What
Claim: collectDeclaredNames knows only the file's own names, so User.FindFirst() in an ASP.NET controller (ControllerBase.User), Settings.Get() on an inherited property, or Cache.Get() on a property of another partial part binds a repository type of that name. C# reads the members of the enclosing type, inherited ones included, before any namespace member (spec 12.8.4). The same gap makes an extension call on an inherited property lost. Pre-existing in v1.0.0.

probes/csharp p42 (OrdersController.cs:5->domain, expected silence), p04 (OrdersController.cs:4->legacy), p18 (OrderService.Get.cs:3->legacy), p30 (WebModule.cs:4->billing missing); same on v1.0.0

## Why


## Acceptance
- [test] A simple name, or the first name of a member access, that names a property, field, method or event declared in any part of the enclosing partial type (a part in another file of the same project included) is that member and gives no type edge (C# spec §12.8.4), with the audit's probe p18 as a catalogue case (silence), red before and green after · by: npm run check
- [test] The same holds for a member that an enclosing type inherits from a base class declared in the repository, through any number of such bases, with p04 as a catalogue case (OrdersController.cs:4 gives no edge to legacy, OrdersController.cs:3 -> core stays), red before and green after · by: npm run check
- [test] An extension call on such a member is a call on a value, so it binds its extension method, with p30 as a catalogue case (WebModule.cs:4 -> billing), red before and green after · by: npm run check
- [test] A private member of a base class is not accessible in the derived type and does not hide a type there, and a name that no part and no repository base of the type declares as a member keeps its type edge (an enum value or a static call inside a derived class), with a case each · by: npm run check
- [test] The corpus gate passes, and every golden line the change moves is explained in the corpus explanation section of the merge · by: npm run corpus

## Changelog
- C#: `Settings.Get()` reads a property `Settings` the class inherits from a base class of the repository, or that another part of the partial class declares, and gives no edge to a static class of that name; an extension call on such a member binds its extension method, so a consumer's graph can show new extension-method edges. Known limit: a member inherited from a base class outside the repository (ASP.NET Core's `ControllerBase.User`) keeps the reading it had, so a same-named type of the repository still gets the edge.

## Evidence

- **ran (history):** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (four probe cases, at 4939332) · **saw:** red: OrdersController.cs:5->domain (p42), OrdersController.cs:4->legacy (p04), OrderService.Get.cs:3->legacy (p18), Order.cs:4->Shared (the reachable-type known-limit case)
- **ran (history):** a conservative fix held uncommitted: no type receiver inside a partial type or a class naming a non-interface base; corpus verify CleanArchitecture,eShop,jellyfin · **saw:** the probes go green, but 50, 41 and 2176 references are lost, mostly true edges (enum and static receivers in derived classes, 54 jellyfin controllers); not committed, a design question for the jarl

The 492 package worker (2026-11-03) found no fix without a cost: silencing type receivers in any partial class or class with a non-interface base turns the probes green but loses 2176 references in jellyfin, 50 in CleanArchitecture and 41 in eShop, mostly true edges (enum and static calls, 54 jellyfin controllers). Options: (a) take that rule, no false edge from hidden members, about 7 percent of C# edges lost; (b) publish member keys and base information so in-repo base chains are judged exactly and silence only bases outside the repository, a new declaration key and SymbolTable lookup, controllers still lose their edges; (c) keep today's behaviour and record the false edge as a known limit. Waits for the owner's word; the patch of (a) is kept outside the repository

Ruling ask-33 (charter, by owner): Krzysztof chose to leave it as it is: a member inherited from a base class outside the repository keeps today's reading, and the false edge is a documented known limit (option 3 of: a check that the type reading is possible, a hand-kept list of framework bases, leave it; the option label is not his wording).

Ruling outside-base-members-stay-a-known-limit (by owner): A member inherited from a base class outside the repository (ASP.NET Core's ControllerBase.User and the like) keeps today's reading in Runes 1.1.0: a same-named repository type still gets the edge, and the changelog and docs state it as a known limit. The lines of 493, 494 and 498 that ask for the outside-base case are dropped; their in-repository lines stand. · the owner's words: "Krzysztof, 2026-11-11 (translated from Polish): "3""
- **ran (line d0bad6f909cb):** RUNES_CORPUS_DIR=<shared cache> npm run corpus, and node scripts/corpus.mjs verify --tier all --only jellyfin,eShop, on the branch tip 68bf674 · **saw:** corpus gate: passed (25 repositories, CleanArchitecture 452 edges, 0 added, 0 removed; go and dotnet oracles SKIPPED, not installed). corpus verify: passed (jellyfin 32640 edges and eShop 2017 edges, 0 added, 0 removed) after the jellyfin golden was regenerated with 212 explained lines: 15 added and 176 removed by this branch, 21 added that the release branch already gave.
- **ran (line d148e7d09727):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-partial-part-property-receiver-silence DIFFERS (OrderService.Get.cs:3 -> legacy). After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. The case passes in silence.
- **ran (line 3808a59e6f8a):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-inherited-property-receiver-edge DIFFERS (OrdersController.cs:4 -> legacy). After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. The case passes: line 3 -> core stays, line 4 gives nothing; the property sits two base classes up.
- **ran (line b8fb474bb861):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** Before: csharp-extension-on-inherited-property-edge DIFFERS (WebModule.cs:4 gives nothing). After: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh. The case passes (WebModule.cs:4 -> billing).
- **ran (line 6a0958815416):** the audit's probe runner over the release branch tip a1ef8c4 with the new case files, then npm run check, on the branch tip 68bf674 · **saw:** csharp-private-base-member-hides-no-type-edge and csharp-derived-class-type-receiver-edge pass before and after (the type edges stay); after: exit 0; tests 2308, pass 2307, fail 0; dist/ is fresh.

Assumed: a field or a property named as its own type (public SourceType SourceType) declares no member, because C# reads that name as the type wherever a type fits (spec 12.8.7.2). Without this the corpus lost 21 true edges to enums in jellyfin.

Assumed: an extension call on a first name the file does not declare, written inside a type, is now given as a candidate group behind a guard that passes only when the name is a member from another part or a base class. A consumer sees one more group per static call inside a type; it binds nothing unless the guard passes. Where the receiver is that member alone, its recorded written type is asked for an instance method the call fits, as for a parameter.

Assumed: the member stop applies to the receiver of a member access only. A constant pattern (o is Name) keeps its reading: whether C# binds the type or a constant there first was not settled here.

For the final pass: README.md has no behaviour paragraph these four issues make untrue. docs/api.md carries one paragraph per issue. The known limit of the ruling (a member inherited from a base class outside the repository keeps its type edge) is stated in the docs/api.md paragraph 'C# members of the enclosing type' and in the changelog field.

