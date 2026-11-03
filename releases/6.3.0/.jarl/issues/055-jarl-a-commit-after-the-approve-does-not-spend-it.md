# 055 · Jarl: a commit after the approve does not spend it

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-876684c1
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (doneRefusalIn), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2037 at a1132a8
**After:** 035

## What
Claim: Done and merged should check that the evidence and the approve are newer than the last commit on the branch.

The gate's window opens at start, reopen or round, never at a commit (help of set). Map row fr-20; issue 002 records branch tips.

## Why


## Acceptance
- merged notes when the tip an approve recorded (002) is not the tip being merged, naming both; a note, never a refusal
- Tested

## Evidence

