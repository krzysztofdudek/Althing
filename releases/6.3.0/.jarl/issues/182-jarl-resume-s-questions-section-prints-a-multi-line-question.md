# 182 · Jarl: resume's questions section prints a multi-line question on several lines, and three refusals print field commands with a filled id

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-099-opus-e
**Where:** lib/resume.mjs the questions section; lib/commands.mjs around lines 1248 and 1264; lib/repositories.mjs line 504
**Branch:** jarl/182-resume-and-brief
**Worker:** w-jarl-182-opus
**Worktree:** /home/me/Worktrees/JarlSkill/182-resume-and-brief
**Since:** 2026-11-08 10:43

## What
The questions section of resume still prints a question of several lines on several lines, where next --as now prints one row. Three refusals print a field command with a filled issue id instead of a form with a placeholder.

## Why
One row per question keeps the list scannable, and a filled command in a refusal can be pasted as printed.

## Acceptance
The questions section prints one row per question, the three refusals end with forms that carry a placeholder, and a test holds each

## Evidence

