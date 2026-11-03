# 502 · C#: the explicit type of a query range variable gives no edge

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-queryrng
**Where:** src/relations/extractors/csharp.mts:829

## What
Claim: from_clause is read for its variable name only; the type in `from Row r in xs` is never emitted (spec 12.20.3.2). Pre-existing in v1.0.0.

probes/csharp p25 and p15 line 7: silence, expected ->models

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Emit the type field of from_clause and join_clause through emitTypeNode.

## Evidence

