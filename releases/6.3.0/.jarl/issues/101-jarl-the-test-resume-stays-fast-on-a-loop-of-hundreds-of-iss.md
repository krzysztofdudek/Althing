# 101 · Jarl: the test 'resume stays fast on a loop of hundreds of issues' fails whenever the machine is loaded, and so turns the whole suite red

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:** tests/resume.test.mjs 'resume stays fast on a loop of hundreds of issues naming another repository and a long log': 7 to 10 s against a 6 s bound on this machine under a load average of 10 to 24; alone it takes about 4 s and passes

## What
A fixed time bound makes the suite's result depend on what else runs on the machine. In this loop it failed in about every full run under load (merges of 075, 029, 063 and others) and always passed alone, so a real regression and a busy machine look the same.

## Why
A flaky red hides real failures and costs a rerun every time; the parallel workers of a loop make load the normal state.

## Acceptance
- The bound compares resume with a baseline measured in the same run (for example a status call on the same loop, or a count of git processes started) so that load moves both, with a test that still fails when resume is made quadratic
- The suite passes under a load average of 20 with the test in place

## Evidence

