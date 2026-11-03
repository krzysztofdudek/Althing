# 009 · Jarl: recording a merge says when the merge commit does not hold both the branch and its base

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
A merger checked a branch whose base had moved on, merged it, and left the base red. The merger reference already says to merge first and check the result, but merged takes any commit and does not look at what it contains.

## Why
A loud note at the moment of recording is the cheapest place to catch a check that ran on the wrong tree.

## Acceptance
- merged --sha notes, loudly, when the recorded commit does not contain the branch tip or does not contain the base as it stands
- The merger reference says once that the check runs on the merge result and that this note means it did not
- Tests for a merge without the base, without the branch, and for the normal case

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

