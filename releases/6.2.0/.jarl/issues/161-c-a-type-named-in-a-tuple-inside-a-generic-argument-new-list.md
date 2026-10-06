# 161 · C#: a type named in a tuple inside a generic argument (new List<(BaseItemDto ItemDto, …)>) gives no edge

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 016
**Found by:** rev-runes-016
**Where:**
**Branch:** jarl/138-csharp-followups
**Merged:** 6a1dea0 in ../../../Runes
**CI:** none

## What
A tuple with named elements as a type argument (new List<(BaseItemDto ItemDto, int Index)>()) does not emit the element types. In jellyfin these are three real edges; 1.0.0 did not see them either, and the first round of 016 caught them by accident.

## Why
A silent dependency in a common C# idiom.

## Acceptance
The tuple element types in a type argument give an edge; a catalogue case red before, green after; no false edge for the element names.

## Changelog
- Fixed: in C#, the element types of a tuple type with named elements used as a type argument and followed by arguments or an initializer (`new List<(BaseItemDto ItemDto, int Index)> { … }`, `new List<(Order Item, int Index)>(n)`, `Make<(Order Item, int Index)>(n)`) give edges; the element names never do.

## Evidence

- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1649, pass 1649, fail 0, catalogue 501 cases, dist/ is fresh; npm run coverage: tests 1649, pass 1649, fail 0, all files 98.78 / 94.07 / 98.76, exit 0; merge 6a1dea0 (catalogue count conflict resolved to 492 + 9 = 501; rebuilt dist matches)

