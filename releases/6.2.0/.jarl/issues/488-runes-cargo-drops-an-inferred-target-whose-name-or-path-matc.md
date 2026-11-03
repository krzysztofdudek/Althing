# 488 · Runes: Cargo drops an inferred target whose name or path matches a declared one, and reads autolib; the resolver does neither

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 481
**Found by:** w-runes-481-opus
**Where:** The 481 worker's report (2026-11-03); Cargo targets.rs seen_names and seen_paths, and autolib
**Branch:** jarl/488-cargo-inferred-dedupe
**Merged:** f431992 in ../../../Runes
**CI:** pending

## What
In every edition Cargo leaves out an inferred target that shares its name or path with a declared one, and autolib = false turns off the inferred library. The resolver keeps such inferred targets as crate roots and ignores autolib.

## Why
A file read as a crate root of its own gives false edges.

## Acceptance
Both rules match Cargo's targets.rs, with a catalogue case each, red before and green after

## Changelog
- Fixed: a Rust file Cargo infers as a bin, test, example or bench is no crate root when a declared target of its kind has its name (including `src/main.rs` against a `[[bin]]` of the package's name with another path), and `src/lib.rs` is no library root under `autolib = false` without a `[lib]` table; a bin without a `path` takes the legacy `src/<name>.rs` when no library is configured or inferred. A consumer's graph loses the edges of such files, so a `use` that resolved there can show a refusal.

## Evidence

From the review of 481 and 484 (rev-runes-481-fable, 2026-11-03), part of this issue: in a 2015 package with autobins = true, a bin whose name two inferred files share is still rooted at both src/bin files, while Cargo drops both by seen_names and builds only the legacy path; and hasLib for the bin fallbacks tests whether the library file exists, where Cargo's has_lib is whether a [lib] is configured or inferred
- **ran:** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs on the four dedupe cases, before the fix · **saw:** red: 4 fail, e.g. unexpected cross-owner edge src/bin/cli.rs:1->util, src/main.rs:1->tools
- **ran:** same command after the dedupe commit, with test/relations/catalogue.test.mjs · **saw:** green: 91 pass, 0 fail (catalogue 646)
- **ran:** same command on the two autolib cases before the fix · **saw:** red: rust-autolib-off-lib-file-module-edge unexpected edge src/lib.rs:1->tools; rust-edition-2015-autolib-off-legacy-bin-path-edge fails
- **ran:** same command after the autolib commit; npm run check; npm run coverage; npm run corpus · **saw:** green: 93 pass in the matrix and catalogue (648 cases); check 2051 pass, check:dist clean; coverage 99.02 lines 94.95 branches 98.93 functions; corpus verify passed, 0 added 0 removed, no golden changed

docs: README.md: none found that the change makes untrue
- **ran:** nice -n 15 timeout 1800 npm run check · **saw:** tests 2051, pass 2051, fail 0; dist/ is fresh (merge f431992 on release/1.1.0)

