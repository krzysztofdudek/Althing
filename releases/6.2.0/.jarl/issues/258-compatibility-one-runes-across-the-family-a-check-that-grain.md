# 258 · Compatibility: one Runes across the family — a check that Grain (vendor), Yggdrasil (npm dependency), Horde (vendor) and Jarl (pin) point to the same Runes version

**Status:** open
**Kind:** test
**Priority:** 2
**Tier:** standard
**Tags:** compatibility, runes
**Files:** Althing/workspace/checks/pins.mjs
**Repo:** ../..
**Found by:** jarl
**Where:**

## What
Runes reaches the family by four routes (Grain and Horde vendor it, Jarl pins it, Yggdrasil depends on it from npm); Grain's contract test guards only the Grain–Yggdrasil pair.

## Why



## Acceptance
One command (a script in the place settled by the decision on the family workspace) reads the four pointers and ends with an error when the versions or commits differ; run in 224 before the tags; the result recorded.

## Evidence


