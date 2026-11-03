# 036 · Jarl: the modules test and seams rule 5 miss an unused default or namespace import and a side-effect upward import, and fail falsely on an import inside some comments

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** refactor
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 030
**Found by:** rev-jarl-030b-opus
**Where:** Review of 030 round 1 (2026-11-03)

## What
An unused default or namespace import is not flagged; seams rule 5 misses a side-effect upward import such as import '../jarl.mjs' (the modules test catches it); an import line inside a /* */ comment whose lines have no leading *, and import( inside any comment, make the test fail falsely.

## Why
A guard with known holes and false reds loses trust.

## Acceptance
Each of the five cases has a fixture that the tests judge correctly

## Evidence

