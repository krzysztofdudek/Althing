# 238 · Runes: extractors climb the ancestors for every node (a quadratic cost on deep files) — context carried down the walk (split off from 188)

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** runes, performance
**Files:** 
**Repo:** ../../../Runes
**Found by:** jarl
**Source:** decisions#plan-6-2-0
**Where:**

## What
Split off from 188 per the 6.2.0 plan (R7).

## Why



## Acceptance
The number of ancestor steps grows linearly with depth in every extractor (a work test on a synthetic deep file); the result does not change (the whole catalogue, the parity tests, the corpus unchanged); a source guard test fails on a new .parent loop in src/relations/extractors/.

## Evidence


