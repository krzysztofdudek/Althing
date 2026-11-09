# 080 · Jarl: models says a fresh clone of a committed loop with no issue yet holds no live loop

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0942-yhfp
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 032
**Found by:** rev-jarl-032-opus
**Where:** Review of 032 (2026-11-03)
**Branch:** jarl/037-notes-and-defaults
**Merged:** 7a10c53 in ../../../JarlSkill
**CI:** none

## What
On a fresh clone of a committed loop that has no issue yet, models prints that the checkout holds no live loop, before and after 032.

## Why
A coordinator reading it thinks the loop is missing.

## Acceptance
models on such a clone reports an empty live loop, with a test

## Changelog
- Fixed: The models view of a fresh copy of a loop that has no issue yet now reports an empty loop instead of saying the loop is missing.

## Evidence

- **ran (history):** node --test --test-name-pattern="fresh clone of a committed loop" tests/models.test.mjs (red, the committed models.mjs) · **saw:** tests 1 · fail 1: Error 'no loop to read here: <temp> holds no live loop — name one with --with <root>, or its archives with --archives' thrown at models.test.mjs:486
- **ran (history):** node --test --test-name-pattern="fresh clone of a committed loop" tests/models.test.mjs (green, after the change) · **saw:** tests 1 · pass 1 · fail 0: 'models on a loop with no issue file yet (a fresh clone of a committed loop) reads an empty live loop, not a missing one' passed
- **ran (history):** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** ℹ tests 860 ℹ pass 837 ℹ fail 0 (merge 7a10c53 on release/6.2.1)

