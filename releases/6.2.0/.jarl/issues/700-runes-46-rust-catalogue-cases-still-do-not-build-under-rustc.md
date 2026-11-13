# 700 · Runes: 46 Rust catalogue cases still do not build under rustc (crate skeletons without a root, dotted keys before [package], [patch] and git sources); rewrite them one by one so each builds, with every expectation change reviewed

**Status:** deferred
**Kind:** test
**Priority:** 3
**Tier:** standard
**Key:** 20261112T0303-jtvn
**Tags:** runes, rust, catalogue
**Files:** 
**Repo:** Runes
**After:** 651
**Found by:** jarl
**Where:** w-645-sonnet, 651 (ruling rust-fixtures-build-list)

## What


## Why
A catalogue case that does not compile cannot show that rustc agrees with the edge it expects; the build test's list makes each one visible until it is fixed.

## Acceptance
[test] The build test's list of Rust cases that do not build is empty apart from the case unparsable on purpose, and each case whose expectation changed says why in its own text · by: npm run check

## Evidence

### Notes

Deferred: after Runes 1.1.0, ruling runes-1-1-0-scope-at-the-cut

