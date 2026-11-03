# 501 · C#: ref and ref readonly types give no edge

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, 1.1.0, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-reftypes
**Where:** src/relations/extractors/csharp.mts:1055

## What
Claim: emitTypeNode has no ref_type case, so a ref return, a ref readonly return and a ref local name nothing (spec 15.6.1, 13.6.2). Pre-existing in v1.0.0.

probes/csharp p23, p24, p15 lines 4 to 6: silence, expected ->models

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Unwrap ref_type to its type, as array_type and nullable_type are.

## Evidence

