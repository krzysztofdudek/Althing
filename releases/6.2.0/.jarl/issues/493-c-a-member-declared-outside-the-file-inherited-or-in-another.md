# 493 · C#: a member declared outside the file (inherited, or in another partial part) is read as a type receiver

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-inhermem
**Where:** src/relations/extractors/csharp.mts:1412

## What
Claim: collectDeclaredNames knows only the file's own names, so User.FindFirst() in an ASP.NET controller (ControllerBase.User), Settings.Get() on an inherited property, or Cache.Get() on a property of another partial part binds a repository type of that name. C# reads the members of the enclosing type, inherited ones included, before any namespace member (spec 12.8.4). The same gap makes an extension call on an inherited property lost. Pre-existing in v1.0.0.

probes/csharp p42 (OrdersController.cs:5->domain, expected silence), p04 (OrdersController.cs:4->legacy), p18 (OrderService.Get.cs:3->legacy), p30 (WebModule.cs:4->billing missing); same on v1.0.0

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Do not emit a receiver reading for a leftmost name inside a type that has a base class outside the file or that is partial, unless the name is also written in a type position of the file; at the least, give such readings silence when the class derives from a type the file does not declare. The parts of a partial type can be read together through the symbol table of member names.

## Evidence

