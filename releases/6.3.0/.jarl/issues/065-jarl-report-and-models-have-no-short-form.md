# 065 · Jarl: report and models have no short form

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-8dc7aacb
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (cmdReport), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:6022 at a1132a8

## What
Claim: models printed about 40 KB where 10 lines were needed. Corrected by the sceptic: The claim narrows to report: a summary or metrics-only form of report; models needs no short form at this size.

models --full is refused as an unknown flag; on the loop copy models was 2,115 bytes and report 109,665 bytes. Map row fr-31.

## Why


## Acceptance
- report prints the loop metrics before the issue lists, and one flag prints the metrics alone
- On a copy of the 6.2.0 loop the metrics-only form is under 10 KB (report is about 110 KB today); report --json keeps everything; tested

## Evidence

