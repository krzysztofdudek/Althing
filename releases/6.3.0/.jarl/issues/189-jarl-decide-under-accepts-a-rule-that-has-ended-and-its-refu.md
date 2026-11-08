# 189 · Jarl: decide --under accepts a rule that has ended, and its refusal lists ended rules among the rulings in force

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-105-opus-g1
**Where:** skills/jarl/scripts/lib/questions.mjs cmdDecide

## What
A ruling can be made under a rule that has ended, which every view then marks not in force; the refusal of --under lists ended rules among the rulings in force.

## Why
A mandate that has ended should not be cited for a new ruling.

## Acceptance
decide --under refuses an ended rule with the form that lists the rulings in force, and the list holds only those in force, with a test

## Evidence

