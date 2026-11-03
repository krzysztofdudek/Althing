# 060 · Jarl: resume shows an answered question instead of its decision

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-95fc042c
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (renderResume), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5967 at a1132a8

## What
Claim: Answered asks appear as Question: lines in the rulings in force.

resume on the loop copy printed 'ask-001 · by owner — **Question:** Should 6.1.1 release...'. Map row fr-26.

## Why


## Acceptance
- resume and decisions print an answered question's ruling (ask-NNN) with its answer first and the question after
- Tested on a copy of the 6.2.0 loop, whose ask-001 resume prints today as the question; red on 71ebc5b

## Evidence

