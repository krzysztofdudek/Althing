# 141 · Kotlin: a nested class with its constructor on the next line without val/var loses deeper declarations (Outer+Inner+Deep) with no marker

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0949-mfge
**Tags:** runes, kotlin
**Files:** Runes/src/relations/extractors/kotlin-recover.mts, Runes/src/relations/extractors/kotlin.mts
**Repo:** ../../../Runes
**After:** 018
**Found by:** runes-018
**Where:**
**Branch:** jarl/165-small-followups
**Merged:** 0861bd7 in ../../../Runes
**CI:** none

## What
After 018: 'class Inner' above 'private constructor(s: String) { class Deep }' parses without an error, so the recovery path does not kick in and Outer+Inner+Deep disappears with no X+* marker.

## Why
A silent loss of declarations: imports of Deep give no edges and nothing signals it.

## Acceptance
The Outer+Inner+Deep declaration is visible or replaced by a marker; a catalogue case red before, green after.

## Changelog
- Fixed: Kotlin imports now give an edge for the declarations inside a nested class whose primary constructor sits on the line below its header and has no val or var parameter (`class Inner` over `private constructor(s: String) { class Deep }`); the shipped grammar read the constructor as one of the enclosing class, without an error, so those declarations were lost with no marker. Where the header cannot be joined to its constructor, the enclosing top-level type is now marked as not fully read.

## Evidence

jarl: Kotlin rev 4 never shipped in any release (1.0.0 has rev 3), so in the final pass of 1.0.1 the rev stays one bump above 1.0.0 — 3→4 is enough; the worker bumped it to 5, to be unified in P6 or left as is (both safe). The new +* markers in clean Kotlin files are the existing 'fail closed' path (silence instead of a false edge) — accepted.
- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1628, pass 1628, fail 0, catalogue 492 cases, dist/ is fresh; npm run coverage: tests 1628, pass 1628, fail 0, all files 98.76 / 94.12 / 98.64, exit 0; merge 0861bd7 (clean merge, branch based on the release tip; 492 = 487 + 5 matches the cases on disk)

