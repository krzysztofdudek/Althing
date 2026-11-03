# 053 · Jarl: some refusals carry no ready command

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-1e512915
**Where:** JarlSkill/skills/jarl/scripts/lib/review.mjs (cmdReview), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4439 at a1132a8

## What
Claim: Each refusal should contain the corrected command.

review without --by names the flag but gives no example line. Map row fr-18; issues 010 and 029 cover part of it.

## Why


## Acceptance
- Every refusal of a writing command ends with a command that would succeed, or names the flag to add, written out
- A test walks the refusals of new, set, review, merged, evidence, field and after and finds none without one

## Evidence

