# 001 · Release 6.2.1

**Status:** open
**Kind:** process
**Priority:** 1
**Tier:** strong
**Key:** 20261022T0714-cbkt
**Tags:** release, needs-owner
**Files:** 
**Found by:** jarl
**Where:**

## What
Ship release 6.2.1: in every repository with work, release/<version> green on its exact commit, the corpus gate and the candidate verdict green, the bump commits, the order to main, the tags through each repository's release workflow, the publish verified, the branches cleaned up.

## Why
A release that skips a step is found by a user after the tag.

## Acceptance
- every step of the shipping checklist in the releasing-the-family skill has a --ran/--saw row
- the owner said to start it, and each push and publish happened on his word
- [check] the full suite passes on the merged result
- [test] a loop in an older format is refused and the refusal names the conversion file
- [read] the skill holds the conversion file, from which an agent converts a loop
- [check] an agent converts this very loop with that file and `verify` is clean
- [check] the word budgets per role hold by a test
- [test] every rule of the design has a test that fails without it
- [read] an independent examiner: the code does what the design says
- [owner] the blind runs have passed and he says this is it

## Evidence

