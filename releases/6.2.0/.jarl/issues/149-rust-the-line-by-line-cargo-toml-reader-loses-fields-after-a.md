# 149 · Rust: the line-by-line Cargo.toml reader loses fields after a multi-line array inside an inline table (e.g. path after features = [...])

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0958-hsbn
**Tags:** runes, rust
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** ../../../Runes
**After:** 015
**Found by:** rev-runes-015
**Where:**
**Branch:** jarl/135-cargo-manifest
**Merged:** a8e0bc4 in ../../../Runes
**CI:** none

## What
parseCargoManifest reads line by line; when an inline table contains a multi-line array (features = [ ... ] over several lines), the fields after it are lost. In zed, reqwest and xim lose package; a path written after a multi-line features would be silent the same way. Behaviour from before 015 (comparison with smol-toml on 334 files).

## Why
A silent loss of path or package in real manifests gives missing edges between crates.

## Acceptance
Fields after a multi-line array in an inline table are read; a test on the shape from zed; a comparison with a TOML parser on the corpus without new discrepancies.

## Changelog
- Fixed: Cargo.toml entries whose inline table holds a multi-line array (`features = [` with the elements on the following lines) are now read in full, so a `path` or `package` written after the array is no longer lost and imports of that crate resolve; the reader also no longer reads the content of a multi-line string (such as a `description = """…"""`) as tables and entries.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1589, pass 1589, fail 0, catalogue 485 cases, dist/ is fresh; npm run coverage: tests 1589, pass 1589, fail 0, all files 98.77 / 94.01 / 98.58, exit 0; merge a8e0bc4 (catalogue count conflict resolved to 483 + 2 = 485)

