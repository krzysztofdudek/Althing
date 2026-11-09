# 502 · C#: the explicit type of a query range variable gives no edge

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0440-izax
**Tags:** 1.1.1, runes, runes-audit
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

### Notes

Ruling backlog-tidy-for-the-three-tools (by owner): On 2026-11-09 the jarl read the backlog for Runes, Yggdrasil and Grain against the release branches and put a list of seven corrections to the owner. His short answer approves that list; the wording below is the jarl's. The release issue 224 waits only on 256 (the upgrade path), 258 (one Runes across Yggdrasil and Grain), 259 (the plugins installed together) and 313, and none of these waits on the workspace issue 275. 255 and 276 are deferred to a later release. 257 and 327 are dropped because they check Jarl 6.2.0, and Jarl 6.2.0 and 6.3.0 are published. 266 is dropped because Althing is already public and pushed. 142 and 143 adopt Runes 1.1.0, because 1.0.1 was never published. 267 and 268 wait on 341, which brings Horde's removal from main into the release branches. 357 joins 356, 502 and 503 join 501, and 510 joins 509. 225, 227, 229, 230 and 232 are deferred to a later release. He did not rule on Grain's hooks or on question a-032, the scope of Runes 1.1.0. · the owner's words: "Krzysztof, 2026-11-09 (translated from Polish): "Yes, the cleanup.""

Dropped: Merged into 501: the same gap in the same walker. Ruling backlog-tidy-for-the-three-tools.

