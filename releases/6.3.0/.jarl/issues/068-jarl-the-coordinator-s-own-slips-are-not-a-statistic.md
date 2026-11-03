# 068 · Jarl: the coordinator's own slips are not a statistic

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-5d619ab6
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (cmdReport), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:6022 at a1132a8
**After:** 035

## What
Claim: Closing too early or merging without the gate is invisible in report. Corrected by the sceptic: The proposal narrows to counting reopens after done, retractions and the closed-gate cases in report; refused writes are not in the record to count.

report counts reopenings; refused commands and reverted states are not counted. Map row fr-36.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: A report section of reopens after done, retractions and refused writes by the coordinator.

## Evidence

