# 113 · Jarl: a refused ask can already raise the record format to 2, and issues in no slice do not count as a slice for the lease refusal in a multi-slice loop

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 085
**Found by:** rev-jarl-085-opus
**Where:** Review of 085 (2026-11-03): cmdAsk, the lease refusal
**Branch:** jarl/187-writes-and-gaps
**Worker:** w-jarl-187-opus
**Worktree:** /home/me/Worktrees/JarlSkill/187-writes-and-gaps
**Since:** 2026-11-08 08:13

## What
Before 085, a refused ask could already move the loop to format 2 (cmdAsk raises before it validates). In a loop with several active slices, issues carrying no slice tag are not counted as a slice by the refusal that asks for declared Files.

## Why
A refused command must write nothing; a refusal rule must name every case it covers.

## Acceptance
A refused ask writes nothing and raises nothing; unsliced issues are treated by the lease rule as the review decides, with tests

## Evidence

