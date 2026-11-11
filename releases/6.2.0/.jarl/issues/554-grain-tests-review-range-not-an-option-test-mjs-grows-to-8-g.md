# 554 · Grain: tests/review-range-not-an-option.test.mjs grows to 8 GB in about 11 seconds, so the full suite cannot finish under a memory cap

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Key:** 20261111T1104-dkel
**Tags:** grain, tests, memory
**Files:** Grain/plugins/grain/tests/review-range-not-an-option.test.mjs
**Repo:** Grain
**Found by:** w-182b-opus
**Where:** plugins/grain/tests/review-range-not-an-option.test.mjs
**Branch:** jarl/554-review-range-memory
**Worker:** w-554-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 11:04

## What
Run alone, the file reaches 8 GB after its 21st passing test, within about 11 seconds, on release/6.2.0 as on the 182 branch; in two full-suite runs it was the file that had just started when the 12 GB cap killed the run. Whether the test or the code under test grows without bound is not established.

## Why
No full Grain suite can finish on a machine with a memory cap, so no Grain change can be shown green.

## Acceptance
[test] The file runs to its end under a 2 GB cap, with the cause of the growth fixed where it lies (the code under test, or the test), red before and green after · by: cd plugins/grain && npm test
[read] The cause is named in the issue with the numbers that show it

## Evidence

