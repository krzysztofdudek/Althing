# 163 · Rust: dependencies = { foo = { path = … } } (one inline table with all the crates) is not read

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** runes, rust
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** ../../../Runes
**After:** 135
**Found by:** runes-135
**Where:**
**Branch:** jarl/165-small-followups
**Merged:** 0861bd7 in ../../../Runes
**CI:** none

## What
Dependencies written as one inline table on the dependencies key are not read by parseCargoManifest.

## Why
A rare but valid TOML form gives silent edges.

## Acceptance
This form gives the same spec as the [dependencies] table; a test with a comparison against a TOML parser.

## Changelog
- Fixed: a Cargo.toml that writes a dependency table as one inline table (`dependencies = { util = { path = "../util" } }`, also under `target` or `workspace`) now declares its path dependencies as the `[dependencies]` table form does; Rust imports of those crates used to stay silent.

## Evidence

- **ran:** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1628, pass 1628, fail 0, catalogue 492 cases, dist/ is fresh; npm run coverage: tests 1628, pass 1628, fail 0, all files 98.76 / 94.12 / 98.64, exit 0; merge 0861bd7 (clean merge, branch based on the release tip; 492 = 487 + 5 matches the cases on disk)

