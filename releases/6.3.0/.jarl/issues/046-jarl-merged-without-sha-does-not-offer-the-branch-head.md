# 046 · Jarl: merged without --sha does not offer the branch head

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-6f9ea020
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdMerged), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2110 at a1132a8
**Branch:** jarl/046-refusal-texts
**Worker:** w-jarl-046-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-046
**Since:** 2026-11-03 10:58

## What
Claim: merged without --sha was refused and the line had to be retyped.

The refusal is immediate and names --sha but gives no ready command. Map row fr-11.

## Why


## Acceptance
- merged without --sha is refused with the ready command written out, carrying the tip of the branch the issue's lease records; with no branch recorded it says so; a merge is never recorded without --sha
- Tests for both cases; red on 71ebc5b

## Evidence

