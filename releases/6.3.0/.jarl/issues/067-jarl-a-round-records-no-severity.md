# 067 · Jarl: a round records no severity

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-e28a4d96
**Where:** JarlSkill/skills/jarl/scripts/lib/review.mjs (cmdReview), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4448 at a1132a8

## What
Claim: A round from a wording note counts the same as one from a broken export.

A changes verdict needs a Critical or Important finding, but round is free text with no severity. Map row fr-35; issue 003 adds a count of findings.

## Why


## Acceptance
- round records the highest severity (Critical or Important) named by the changes verdict that caused it, and report splits rounds by that severity
- Tested; a round with no changes verdict before it records none and says so

## Evidence

Dropped: the view and the measures they belonged to are out by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost

