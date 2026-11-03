# 480 · Runes: the ancestor guard misses a climb written with optional chaining or recursion, and the work test passes Rust, C and C++ on its allowance alone

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** runes, performance, 1.1.0
**Files:** 
**Repo:** ../../../Runes
**After:** 238
**Found by:** rev-runes-238-opus
**Where:** Review of 238 (2026-11-03): ancestor-guard.test.mjs and the work test
**Branch:** jarl/480-ancestor-guard-forms
**Merged:** 5dd7a5b in ../../../Runes
**CI:** green

## What
The source guard's pattern does not match x = x?.parent or a recursive f(node.parent), and the work test counts only .parent accessor calls, so for Rust, C and C++, which now make none, it passes on its +20 allowance without measuring anything.

## Why
A guard that a different spelling slips past, and a bound that measures nothing for three languages, both give false greens.

## Acceptance
- The guard fails on an optional-chaining climb and on a recursive climb, with a fixture for each
- The work test measures a quantity that grows with depth for every extractor it covers, or says per language why none is needed

## Changelog


## Evidence

- **ran:** node --test test/relations/extractors/ancestor-guard.test.mjs, with the old patterns and the new fixtures · **saw:** scan test fails: actual 0, expected 1 on the optional-chaining and recursive fixtures
- **ran:** node --test ancestor-guard.test.mjs ancestor-walk.test.mjs; npm run check; npm run coverage · **saw:** guard 2 pass; work test 18 pass incl. rust, c, cpp with a non-empty, growing, linear tree-access count; check 1991 pass, dist fresh; coverage 99.10/94.96/99.16
- **ran:** node --test ancestor-guard.test.mjs with the formatScope, forwardTo, nested-bracket and seen.has fixtures against the previous pattern · **saw:** scan test failed: actual 0, expected 1 at the formatScope fixture
- **ran:** node --test ancestor-walk.test.mjs with the cursor members not counted · **saw:** 18 pass, 1 fail: the quadratic cursor walk fixture was let through by the bound
- **ran:** node --test ancestor-guard.test.mjs ancestor-walk.test.mjs; npm run check · **saw:** all pass (21 tests); check 1992 pass, dist fresh
- **ran:** nice -n 15 timeout 1800 npm run check; node scripts/corpus.mjs verify --tier all · **saw:** check: tests 2028, pass 2028, fail 0, dist/ is fresh, catalogue 630; corpus verify: passed on all 33 repositories (5dd7a5b on release/1.1.0: 472 merged at 7e067a0, 480 at 5dd7a5b)

