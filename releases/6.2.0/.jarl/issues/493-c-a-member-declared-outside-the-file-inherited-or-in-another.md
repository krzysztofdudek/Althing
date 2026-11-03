# 493 · C#: a member declared outside the file (inherited, or in another partial part) is read as a type receiver

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 1.1.1, must-for-1.1.0, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-inhermem
**Where:** src/relations/extractors/csharp.mts:1412
**Branch:** jarl/492-csharp-member-and-arity-lookup

## What
Claim: collectDeclaredNames knows only the file's own names, so User.FindFirst() in an ASP.NET controller (ControllerBase.User), Settings.Get() on an inherited property, or Cache.Get() on a property of another partial part binds a repository type of that name. C# reads the members of the enclosing type, inherited ones included, before any namespace member (spec 12.8.4). The same gap makes an extension call on an inherited property lost. Pre-existing in v1.0.0.

probes/csharp p42 (OrdersController.cs:5->domain, expected silence), p04 (OrdersController.cs:4->legacy), p18 (OrderService.Get.cs:3->legacy), p30 (WebModule.cs:4->billing missing); same on v1.0.0

## Why


## Acceptance
- A name that is a member inherited from a base type, or declared in another part of a partial type, is not read as a type (C# 12.8.4), with the audit's probes as catalogue cases (User.FindFirst in a controller beside a domain User), red before and green after, and a control where the name is a type
- The C# matrix and parity tests are unchanged apart from the new cases, and the corpus goldens change only by explained lines

## Evidence

- **ran:** node --test test/relations/extractors/csharp-name-resolution-matrix.test.mjs (four probe cases, at 4939332) · **saw:** red: OrdersController.cs:5->domain (p42), OrdersController.cs:4->legacy (p04), OrderService.Get.cs:3->legacy (p18), Order.cs:4->Shared (the reachable-type known-limit case)
- **ran:** a conservative fix held uncommitted: no type receiver inside a partial type or a class naming a non-interface base; corpus verify CleanArchitecture,eShop,jellyfin · **saw:** the probes go green, but 50, 41 and 2176 references are lost, mostly true edges (enum and static receivers in derived classes, 54 jellyfin controllers); not committed, a design question for the jarl

The 492 package worker (2026-11-03) found no fix without a cost: silencing type receivers in any partial class or class with a non-interface base turns the probes green but loses 2176 references in jellyfin, 50 in CleanArchitecture and 41 in eShop, mostly true edges (enum and static calls, 54 jellyfin controllers). Options: (a) take that rule, no false edge from hidden members, about 7 percent of C# edges lost; (b) publish member keys and base information so in-repo base chains are judged exactly and silence only bases outside the repository, a new declaration key and SymbolTable lookup, controllers still lose their edges; (c) keep today's behaviour and record the false edge as a known limit. Waits for the owner's word; the patch of (a) is kept outside the repository

