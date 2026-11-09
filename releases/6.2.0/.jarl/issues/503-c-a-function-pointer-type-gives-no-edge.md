# 503 · C#: a function pointer type gives no edge

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-nenf
**Tags:** 1.1.1, runes, runes-audit
**Files:** 
**Repo:** ../../../Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-fnptrtyp
**Where:** src/relations/extractors/csharp.mts:1068

## What
Claim: function_pointer_type falls to the default of emitTypeNode, so `delegate*<Order, void>` names nothing. Pre-existing in v1.0.0.

probes/csharp p34: silence, expected Native.cs:4->models

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Descend function_pointer_type into each function_pointer_parameter's type.

## Evidence

