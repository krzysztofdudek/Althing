# 139 · C#: stackalloc Foo[n] with a bare type name gives no edge

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0945-iypz
**Tags:** runes, csharp
**Files:** Runes/src/relations/extractors/csharp.mts
**Repo:** ../../../Runes
**After:** 016
**Found by:** runes-016
**Where:**
**Branch:** jarl/138-csharp-followups
**Merged:** 6a1dea0 in ../../../Runes
**CI:** none

## What
stackalloc Foo[n] does not emit the element type. The csharp-pointer-stackalloc-element case passes only because Foo* p stands on the same line.

## Why
A silent dependency in low-level code; the catalogue test gives a false sense of coverage.

## Acceptance
stackalloc Foo[n] on a line of its own gives an edge; a catalogue case that checks it without help from another construct.

## Changelog
- Fixed: in C#, `stackalloc Foo[n]` names its element type `Foo`, so a local initialised by it (`var s = stackalloc Foo[n];`) gives the edge.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1649, pass 1649, fail 0, catalogue 501 cases, dist/ is fresh; npm run coverage: tests 1649, pass 1649, fail 0, all files 98.78 / 94.07 / 98.76, exit 0; merge 6a1dea0 (catalogue count conflict resolved to 492 + 9 = 501; rebuilt dist matches)

