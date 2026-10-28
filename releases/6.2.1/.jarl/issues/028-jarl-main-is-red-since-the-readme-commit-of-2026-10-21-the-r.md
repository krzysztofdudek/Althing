# 028 · Jarl: main is red since the README commit of 2026-10-21; the README says what the code does again

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:**

## What
CI on main failed on 3ae1f4e (README: what you install and why, in one order; social card on top), run 39554635835: five of the tests that hold the README to the code fail: the drop-in copies the whole skills/jarl/ directory (the README names ~/.agents/skills/jarl/), a loop is found at the root of a checkout, the README says who verifies, no version-shaped token in prose, and the tense test. Nothing was published by it: the release workflow found the version already tagged.

## Why
A red main is the base release/6.2.1 is cut from; and a README that the tests reject tells people something the code does not do.

## Acceptance
The README text and the tests agree again, the README keeping the owner's new order and card; the full suite and CI are green on main

## Evidence

