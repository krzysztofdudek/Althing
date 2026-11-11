# 501 · C#: ref types, the explicit type of a query range variable and function pointer types give no edge

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-gayl
**Tags:** 1.1.1, runes, runes-audit
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** Runes
**Found by:** research research/2026-11-03-runes-csharp-and-cargo-remaining-gaps
**Source:** research/2026-11-03-runes-csharp-and-cargo-remaining-gaps#csharp-1-reftypes
**Where:** src/relations/extractors/csharp.mts:1055
**Branch:** jarl/499-csharp-type-positions
**Worker:** w-499-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:51

## What
Three type positions name nothing, so the edge is lost. emitTypeNode has no ref_type case, so a ref return, a ref readonly return and a ref local give no edge (spec 15.6.1, 13.6.2). from_clause is read for its variable name only, so the type in `from Row r in xs` is never emitted (spec 12.20.3.2). function_pointer_type falls to the default of emitTypeNode, so `delegate*<Order, void>` names nothing. All three already exist in v1.0.0. Probes: csharp p23, p24, p15 lines 4 to 7, p25, p34. Issues 502 and 503 were merged into this one.

## Why


## Acceptance
- [test] A ref return, a ref readonly return and a ref local give an edge to the named type, with p23, p24 and p15 lines 4 to 6 as catalogue cases, red before and green after · by: npm run check
- [test] The type in a from clause and in a join clause gives an edge, with p25 and p15 line 7 as catalogue cases, red before and green after · by: npm run check
- [test] A function pointer type gives an edge to each parameter type, with p34 as a catalogue case, red before and green after · by: npm run check

## Evidence

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

