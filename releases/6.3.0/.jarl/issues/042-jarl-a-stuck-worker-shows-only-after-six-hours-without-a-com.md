# 042 · Jarl: a stuck worker shows only after six hours without a commit

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-0d440c8f
**Where:** JarlSkill/skills/jarl/scripts/lib/rounds.mjs (leaseProblems), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4794 at a1132a8
**After:** 035

## What
Claim: Workers sat stuck on a permission prompt or idle on a shared lock while the record said in flight. Corrected by the sceptic: Severity medium rather than high: a 30-minute warning is available today through the flag; what is missing is reading the row and log ages, a goal line for the threshold, and the same threshold in resume.

A lease is idle only after STALE_HOURS (6) with no commit on its branch; the last evidence row and log line are not read, and the threshold is a flag, not a goal line. Map row fr-07.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Show per in-flight issue the age of its last row, commit and log line, with a warning threshold in minutes set in goal.md.

## Evidence

