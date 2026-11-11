# 623 · Runes: the wide-node timing tests' 10 s bound fails under npm run coverage, so the coverage gate is red on release/1.1.0

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** light
**Key:** 20261111T1645-isdy
**Tags:** runes, tests
**Files:** Runes/test/relations/extractors/wide-node.test.mjs
**Repo:** Runes
**Found by:** jarl
**Where:** w-494-fable, round 2 of the C# package; release/1.1.0 at 262238e took 9.9 s and 11.6 s under coverage

## What


## Why
Coverage instrumentation slows the parse and extraction by about a fifth, so a bound set for a plain run fails the coverage gate one run in two on the release itself, a false red for every package.

## Acceptance
[test] The wide-node tests keep a bound that fails the pre-168 walker and the pre-566 extractors by a wide margin and passes under npm run coverage on a loaded machine, five runs of five · by: npm run check

## Evidence

