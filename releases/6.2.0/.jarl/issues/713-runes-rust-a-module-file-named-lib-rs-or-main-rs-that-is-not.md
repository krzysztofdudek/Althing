# 713 · Runes, Rust: a module file named lib.rs or main.rs that is not a crate root keeps its inline modules beside it, so a #[path] in an inline module there is placed wrongly (a false edge)

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261112T0400-spri
**Tags:** runes, rust
**Files:** Runes/src/relations/extractors/rust-resolve.mts
**Repo:** Runes
**After:** 651
**Found by:** jarl
**Where:** rev-645b-opus, round 2 (src/relations/resolve-path.mts:122, holdsModulesBeside)
**Branch:** jarl/733-ci-green
**Worker:** w-733-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-13 16:39

## What


## Why
holdsModulesBeside takes any lib.rs or main.rs for a crate root by its name; src/a/lib.rs reached as mod lib keeps its inline modules in a folder of its own name, as rustc reads it.

## Acceptance
[test] With src/lib.rs (mod a), src/a.rs (mod lib) and src/a/lib.rs (mod outer { #[path = "loaded.rs"] mod x; }), Runes places x at src/a/lib/outer/loaded.rs, as rustc does, and gives no edge from src/a/outer/loaded.rs, as a catalogue case, red before and green after · by: npm run check

## Evidence

