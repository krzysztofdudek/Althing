# 072 · Jarl: nothing re-checks a recorded attachment after done

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-682b8652
**Where:** JarlSkill/skills/jarl/scripts/lib/evidence.mjs (cmdEvidence), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2683 at a1132a8

## What
Claim: Evidence says 'rendered 73 pages' but not where they are or whether they still exist.

evidence --file --slot records path, sha256 and size and done re-checks them, only inside the loop root and only for profile slots. Map row fr-40.

## Why


## Acceptance
- verify lists each recorded attachment whose file is gone or whose hash no longer matches, with its issue and slot
- Tested by removing one attached file and editing another on a copy; red on 71ebc5b

## Evidence

Dropped: the view and the measures they belonged to are out by ruling design-6-3-0-narrowed-no-run-no-digest-no-cost

