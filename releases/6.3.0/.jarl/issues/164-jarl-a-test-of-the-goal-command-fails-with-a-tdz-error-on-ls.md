# 164 · Jarl: a test of the goal command fails with a TDZ error on LS when run alone with --test-name-pattern

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-128-sonnet
**Where:** Report of the worker of 128 (package C), Found

## What
tests/jarl.test.mjs, the test 'goal --set refuses a line break…', throws a temporal-dead-zone error on LS when it is run alone with --test-name-pattern; it passes in the full suite. A worker who runs one test as the brief tells them to hits it.

## Why
A test that depends on the order of the others hides a real error and wastes a worker's time.

## Acceptance
Every test of tests/jarl.test.mjs passes when run alone with --test-name-pattern, and a check runs each test alone or the shared setup is moved to where every test reaches it

## Evidence

