# 472 · Runes: in an edition 2015 package, declaring any [[bin]] turns bin auto-discovery off, but the resolver still roots src/main.rs and src/bin files there

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 470
**Found by:** rev-runes-470-opus
**Where:** Review of 470 (2026-11-02); The Cargo Book, Target auto-discovery: in the 2015 edition a declared target turns off auto-discovery of its kind unless autobins is set
**Branch:** jarl/472-rust-2015-bin-discovery
**Worker:** w-runes-472-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/Runes-472
**Since:** 2026-11-03 01:04

## What
The resolver reacts only to an explicit autobins = false. In an edition 2015 package that declares a [[bin]] and leaves autobins unset, Cargo builds only the declared bins, yet the resolver still treats src/main.rs and src/bin files as crate roots. The new edition 2015 crate-root-item check also matches a name that exists only inside an inline mod or a function body of the root file.

## Why
A file that is no crate root read as one gives false edges, the kind that can force a cycle.

## Acceptance
- In an edition 2015 package with a declared [[bin]] and no autobins key, only declared bins are crate roots, with a catalogue case red before and green after, and a 2018 control where discovery stays on
- The edition 2015 crate-root-item check matches only items at the top level of the root file, with a case for a name inside an inline mod

## Changelog
- Fixed: in an edition 2015 package that declares a `[[bin]]` and leaves `autobins` unset, `src/main.rs` and the files of `src/bin` that no bin names are no longer crate roots, and a 2015 `use Name;` binds the crate root only for an item defined at its top level, not one inside an inline `mod` or a function body; a consumer's graph can lose edges it showed before, and so lose cycles it gave

## Evidence

- **ran:** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs (fix held back) · **saw:** red: rust-edition-2015-use-crate-root-item-inline-mod-silence failed (pass 60, fail 1); then rust-edition-2015-declared-bin-main-silence failed (pass 63, fail 1); the 2018 and autobins = true controls passed
- **ran:** node --test the same matrix file and test/relations/extractors/rust-resolve.test.mjs, then npm run check, npm run coverage, corpus verify --tier all · **saw:** green: 131 pass 0 fail; check 1967 pass 0 fail, dist fresh; coverage 99.06 lines 94.85 branches 99.15 functions; corpus passed, no explained or changed references
- **ran:** matrix file without the legacy bin path, then with it · **saw:** red: 3 legacy-bin-path cases failed (pass 64, fail 3); green: 68 pass 0 fail; check 1990 pass, coverage 99.11/95.00/99.16, corpus passed with no changes

