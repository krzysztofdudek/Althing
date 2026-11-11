# 490 · Runes: under autolib = false with no [lib], a use of the package's own crate name from a bin still resolves into src/lib.rs

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0413-rwnd
**Tags:** 1.1.1, runes, rust
**Files:** Runes/src/relations/extractors/resolve-path.mts
**Repo:** Runes
**After:** 488
**Found by:** w-runes-488-sonnet
**Where:** The 488 worker's report (2026-11-03): crateRootFor and dependencyFor keep the lib tree at src/lib.rs
**Branch:** jarl/490-autolib-and-corpus
**Worker:** w-490-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 10:35

## What
488 makes src/lib.rs no crate root under autolib = false without a [lib] table, but crateRootFor and dependencyFor still point the package's library at src/lib.rs, so use app::x from a bin can bind there.

## Why
A false edge into a file Cargo does not build as a library.

## Acceptance
Under autolib = false with no [lib], use <package>::x from a bin gives no edge into src/lib.rs, with a case red before and green after

## Changelog
- A bin that uses its own package name (`use app::x;`), and a package that depends by path on one, no longer get an edge into `src/lib.rs` when the package writes `autolib = false` and no `[lib]` table, since Cargo builds no library there; a `[lib]` table keeps the library.

## Evidence

### Proof

- **ran (line 40ce14f3975d):** node --test test/relations/extractors/rust-name-resolution-matrix.test.mjs test/relations/catalogue.test.mjs, at the commit that adds the cases and before the fix · **saw:** pass 100, fail 2: rust-autolib-off-own-crate-name-from-bin-silence and rust-autolib-off-path-dependency-without-lib-silence fail with 'unexpected cross-owner edge' into util; the [lib] guard case passes
- **ran (line 40ce14f3975d):** npm run check, on the clean committed tip · **saw:** tests 2114, pass 2113, fail 0 (1 skipped), dist/ is fresh; the matrix and the catalogue count 684 pass, the two silence cases green

### Notes

Assumed: the review's wording 'react-14' for the false lockfile claim is not what the pinned react commit shows (react-14 has a yarn.lock); the reason that names a lockfile the fixture lacks is fixtures/eslint-v10 (package.json, no yarn.lock), so that entry is the one corrected. Assumed: the hiredis answer is made compiler-neutral in the oracle (gcc's directive echo and the quotes dropped) rather than by loosening how entries match, since entries match exactly by design. Assumed: a Rust package without a library gives a null library tree, so its own crate name falls through to the dependency and edition-2015 forms instead of returning silence at once.

