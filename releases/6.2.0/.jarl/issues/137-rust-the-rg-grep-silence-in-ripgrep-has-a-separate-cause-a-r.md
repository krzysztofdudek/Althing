# 137 · Rust: the rg → grep silence in ripgrep has a separate cause (a re-exported extern crate or a [[bin]] path)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, rust
**Files:** Runes/src/relations/extractors/rust.mts, Runes/src/relations/resolve-path.mts
**Repo:** ../../../Runes
**Found by:** runes-015
**Where:**
**Branch:** jarl/135-cargo-manifest
**Merged:** a8e0bc4 in ../../../Runes
**CI:** none

## What
The verifier of 017 and the planner noted that in ripgrep the rg → grep edge is silent for a different reason than the use list: most likely a re-exported extern crate or a binary crate pointed to by a [[bin]] path. Not reproduced separately.

## Why
A missing edge between crates in a real project; a forbidden import would pass unnoticed.

## Acceptance
The cause established on ripgrep, a case in the relation catalogue that shows it, red before and green after (or a documented silence with a reason).

## Changelog
- Fixed: a Rust path through a dependency's re-exported extern crate (`grep::printer::Standard`, where the `grep` crate root declares `pub extern crate grep_printer as printer;`) now gives an edge to that dependency's crate root file; before, names bound by `extern crate` were not counted as declared there and every such import was silent (ripgrep's rg → grep).

## Evidence

- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1589, pass 1589, fail 0, catalogue 485 cases, dist/ is fresh; npm run coverage: tests 1589, pass 1589, fail 0, all files 98.77 / 94.01 / 98.58, exit 0; merge a8e0bc4 (catalogue count conflict resolved to 483 + 2 = 485)

