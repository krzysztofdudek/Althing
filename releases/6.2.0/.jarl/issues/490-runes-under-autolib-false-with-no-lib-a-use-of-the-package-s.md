# 490 · Runes: under autolib = false with no [lib], a use of the package's own crate name from a bin still resolves into src/lib.rs

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, rust, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 488
**Found by:** w-runes-488-sonnet
**Where:** The 488 worker's report (2026-11-03): crateRootFor and dependencyFor keep the lib tree at src/lib.rs

## What
488 makes src/lib.rs no crate root under autolib = false without a [lib] table, but crateRootFor and dependencyFor still point the package's library at src/lib.rs, so use app::x from a bin can bind there.

## Why
A false edge into a file Cargo does not build as a library.

## Acceptance
Under autolib = false with no [lib], use <package>::x from a bin gives no edge into src/lib.rs, with a case red before and green after

## Evidence

