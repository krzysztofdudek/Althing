# 480 · Runes: the ancestor guard misses a climb written with optional chaining or recursion, and the work test passes Rust, C and C++ on its allowance alone

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** runes, performance, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 238
**Found by:** rev-runes-238-opus
**Where:** Review of 238 (2026-11-03): ancestor-guard.test.mjs and the work test

## What
The source guard's pattern does not match x = x?.parent or a recursive f(node.parent), and the work test counts only .parent accessor calls, so for Rust, C and C++, which now make none, it passes on its +20 allowance without measuring anything.

## Why
A guard that a different spelling slips past, and a bound that measures nothing for three languages, both give false greens.

## Acceptance
- The guard fails on an optional-chaining climb and on a recursive climb, with a fixture for each
- The work test measures a quantity that grows with depth for every extractor it covers, or says per language why none is needed

## Evidence

