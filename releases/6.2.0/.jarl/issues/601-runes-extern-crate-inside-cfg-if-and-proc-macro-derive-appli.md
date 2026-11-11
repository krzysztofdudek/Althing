# 601 · Runes: extern crate inside cfg_if! and proc_macro_derive applied through cfg_attr are not read

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1446-abug
**Tags:** runes, rust
**Files:** 
**Repo:** Runes
**After:** 517, 513
**Found by:** jarl
**Where:** w-523-fable, the Rust roots package

## What


## Why
Both are common in published crates; a name they bind gives no edge or a wrong one.

## Acceptance
[test] An extern crate inside a cfg_if! block binds its name as a plain one does, and #[cfg_attr(feature = "x", proc_macro_derive(Name))] makes Name a root item, each a catalogue case, red before and green after · by: npm run check

## Evidence

