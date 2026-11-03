# 484 · Runes: Cargo 2015 target rules left after 472 (a bin name shared with an inferred target, bin = [], a library found only at src/<libname>.rs)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 472
**Found by:** rev-runes-472b-opus
**Where:** Review of 472 round 1 (2026-11-03), against Cargo 0.85.0 targets.rs

## What
When two inferred targets share a bin's name, Cargo takes the legacy path; an empty bin = [] turns bin discovery off; a 2015 library found only at its legacy path src/<libname>.rs does not count as having a library for the bin fallbacks.

## Why
Each misplaces a crate root in old crates, which gives false or lost edges.

## Acceptance
Each of the three rules matches Cargo's targets.rs, with a catalogue case each, red before and green after

## Evidence

