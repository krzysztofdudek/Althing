# 062 · Jarl: resume prints every ruling in force

**Status:** dropped
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-5dc93428
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (renderResume), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5967 at a1132a8
**After:** 035

## What
Claim: 47 rulings print on every resume.

The loop copy printed 'Rulings in force (102)'; the whole resume was 309 lines and 41,043 bytes. Map row fr-28.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Print the rulings that touch open or in-flight issues, then a count and decisions --live.

## Evidence

Dropped: folded into 086 (resume no longer prints every ruling in force), report section 11

