# 162 · Rust: [[bin]] path in Cargo.toml is ignored, so crate:: paths from the binary's file (e.g. crates/core/main.rs in ripgrep) do not resolve

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Key:** 20261002T1038-cbtc
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
The root of a binary crate pointed to by a [[bin]] path is unknown to the resolver, so crate::flags::HiArgs from crates/core/main.rs in ripgrep gives undefined.

## Why
Silent edges inside binary crates in real projects.

## Acceptance
A root from a [[bin]] path resolves crate:: paths; a catalogue case red before, green after.

## Changelog
- Fixed: Rust `crate::`, `self::` and `super::` paths in a binary whose root a `[[bin]]` table places outside the auto-discovered targets (ripgrep's `crates/core/main.rs`) now resolve inside that binary's crate; they used to resolve to nothing, or to a same-named module under `src/`.

## Evidence

- **ran (history):** nice -n 15 npm run check && nice -n 15 npm run coverage (release/1.0.1) · **saw:** npm run check: tests 1628, pass 1628, fail 0, catalogue 492 cases, dist/ is fresh; npm run coverage: tests 1628, pass 1628, fail 0, all files 98.76 / 94.12 / 98.64, exit 0; merge 0861bd7 (clean merge, branch based on the release tip; 492 = 487 + 5 matches the cases on disk)

