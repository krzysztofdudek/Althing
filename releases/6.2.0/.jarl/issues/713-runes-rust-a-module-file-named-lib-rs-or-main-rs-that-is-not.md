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

## Changelog
- Fixed: Rust: a module file named `lib.rs` or `main.rs` that is not a crate root (declared with `mod lib;`) now holds its inline modules in a directory of its own name, so a `#[path]` module inside one binds the file rustc loads and no stray file beside it.

## Evidence

### Proof

- **ran (line d33f028e7fa7):** node --test --test-name-pattern=module-file-named-lib test/relations/extractors/rust-name-resolution-matrix.test.mjs (at 808f46e, the case before the fix) · **saw:** not ok: expected edge src/a/lib/outer/loaded.rs:1->child not emitted (got src/lib.rs:1->a, src/a.rs:1->lib, src/a/outer/loaded.rs:1->decoy)
- **ran (line d33f028e7fa7):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (at 94b0558, after the fix) · **saw:** # tests 212 # pass 212 # fail 0
- **ran (line d33f028e7fa7):** npm run check (at 94b0558) · **saw:** tests 2682, pass 2679, fail 0, skipped 3; catalogue holds 962 cases; dist/ is fresh

