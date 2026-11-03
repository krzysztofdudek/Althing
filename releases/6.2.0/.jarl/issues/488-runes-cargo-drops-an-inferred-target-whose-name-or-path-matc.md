# 488 · Runes: Cargo drops an inferred target whose name or path matches a declared one, and reads autolib; the resolver does neither

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 481
**Found by:** w-runes-481-opus
**Where:** The 481 worker's report (2026-11-03); Cargo targets.rs seen_names and seen_paths, and autolib

## What
In every edition Cargo leaves out an inferred target that shares its name or path with a declared one, and autolib = false turns off the inferred library. The resolver keeps such inferred targets as crate roots and ignores autolib.

## Why
A file read as a crate root of its own gives false edges.

## Acceptance
Both rules match Cargo's targets.rs, with a catalogue case each, red before and green after

## Evidence

From the review of 481 and 484 (rev-runes-481-fable, 2026-11-03), part of this issue: in a 2015 package with autobins = true, a bin whose name two inferred files share is still rooted at both src/bin files, while Cargo drops both by seen_names and builds only the legacy path; and hasLib for the bin fallbacks tests whether the library file exists, where Cargo's has_lib is whether a [lib] is configured or inferred

