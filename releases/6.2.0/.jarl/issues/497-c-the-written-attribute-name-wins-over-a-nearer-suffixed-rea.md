# 497 · C#: the written attribute name wins over a nearer suffixed reading, and a non-attribute class counts

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0440-irqq
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-attrread
**Where:** src/relations/extractors/csharp.mts:1827

## What
Claim: pushAttribute merges every reading of the written name before every reading of the Attribute-suffixed name, and any class binds. C# resolves both and takes the one that is an attribute class (spec 23.3). An entity Required beside RequiredAttribute gives the edge to the entity; a nearer App.Web.AuditAttribute loses to a plain Lib.Audit from a using. Pre-existing in v1.0.0.

probes/csharp p09 (Dto.cs:5->domain, expected val), p10 (Controller.cs:4->lib, expected attrs); same on v1.0.0

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Resolve the two readings as two groups; when both bind to different owners, silence; when only one binds, take it. A declaration index of which classes derive (by name) from Attribute could break the tie later.

## Evidence

