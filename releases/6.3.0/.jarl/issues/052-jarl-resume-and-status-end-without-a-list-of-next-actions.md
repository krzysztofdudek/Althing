# 052 · Jarl: resume and status end without a list of next actions

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-e9558e49
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (renderResume), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5975 at a1132a8
**After:** 035

## What
Claim: After a compaction the coordinator works out the next step from about 200 lines of state.

resume prints ready issues, the merge queue and questions as separate blocks and ends with log lines. Map row fr-17.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: End resume and status with at most 7 actions ordered by what they unblock, each with its command.

## Evidence

