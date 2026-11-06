# 007 · Jarl: a review queue, with the issues that wait for a reviewer offered as one batch

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**After:** 035, 052, 085, 086
**Branch:** jarl/007-review-queue
**Worker:** w-jarl-007-opus
**Worktree:** /home/me/Worktrees/JarlSkill/007-review-queue
**Since:** 2026-11-06 19:10

## What
Status marks issues that wait for a reviewer, but there is no view a coordinator can hand one reviewer from, and nothing suggests reviewing several ready issues together. Coordinators built batches by hand to save cost.

## Why
One reviewer reading several small ready branches at once costs less than one per issue and loses little; the record already knows which are ready.

## Acceptance
- A coordinator's list (next --as, 052, over its slice, 085) groups its issues waiting for a verdict into units one reviewer may take under the built-in rule of 086: one shared review only over issues that are one contract or one screen, at most four
- Each grouped unit names why it may be grouped; tests

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

