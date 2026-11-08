# 186 · Jarl: a brief finding whose verdict has no entry left points to a Reviews section that does not hold its text, with no note saying so

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-082-opus-r3
**Where:** skills/jarl/scripts/lib/brief.mjs the pointer of a finding; tests/brief.test.mjs the POINTER tests
**Branch:** jarl/182-resume-and-brief
**Worker:** w-jarl-182-opus
**Worktree:** /home/me/Worktrees/JarlSkill/182-resume-and-brief
**Since:** 2026-11-08 10:43

## What
Where one verdict's entry in the Reviews section is lost and the other is told apart, the log line's pointer names a Reviews section that does not hold the text, and no note says so. A one-line note is only true when no entry is left over.

## Why
A pointer that promises more than the output gives is false.

## Acceptance
The brief says in one line when the pointer leads to text the section no longer holds, the four POINTER tests are updated for it, and a test holds the case

## Evidence

