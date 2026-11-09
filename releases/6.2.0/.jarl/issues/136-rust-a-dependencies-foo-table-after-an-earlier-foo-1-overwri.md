# 136 · Rust: a [dependencies.foo] table after an earlier foo = "1" overwrites the first entry instead of keeping the first (behaviour from before 015)

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0944-iusf
**Tags:** runes, rust
**Files:** Runes/src/relations/resolve-path.mts
**Repo:** ../../../Runes
**Found by:** runes-015
**Where:**
**Branch:** jarl/135-cargo-manifest
**Merged:** a8e0bc4 in ../../../Runes
**CI:** none

## What
In parseCargoManifest a [dependencies.foo] table that stands after 'foo = "1"' changes the earlier entry, though for plain keys the first one wins. The behaviour existed before 015; the worker did not change it.

## Why
An inconsistent precedence rule can pin a path from a later table; cargo rejects a double declaration, so Runes should behave predictably.

## Acceptance
One precedence rule for all forms of a crate declaration, with a test for this order.

## Changelog
- Fixed: in Cargo.toml, a `[dependencies.<name>]` table written after an earlier declaration of the same crate no longer overwrites that declaration's path, package or workspace fields; the first declaration of a crate now wins for every form (whole value, dotted key, table), so a later table can no longer pin a path the first declaration never gave.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1589, pass 1589, fail 0, catalogue 485 cases, dist/ is fresh; npm run coverage: tests 1589, pass 1589, fail 0, all files 98.77 / 94.01 / 98.58, exit 0; merge a8e0bc4 (catalogue count conflict resolved to 483 + 2 = 485)

