# 111 · Jarl: the resume timing test's time limit depends on how fast git starts, a quadratic of about a second passes it, and the test now takes 20 to 40 seconds

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 101
**Found by:** rev-jarl-101-opus
**Where:** Review of 101 (2026-11-03): tests/resume.test.mjs

## What
The new bound is measured against one git process start, so it moves with the machine's git; a slowdown of about a second passes; the test takes 20 to 40 seconds.

## Why
A test about speed should catch a real slowdown cheaply and stay quiet under load.

## Acceptance
The test stays under 10 seconds, catches a slowdown of a few times the baseline, and is stable under load, with the red shown

## Evidence

