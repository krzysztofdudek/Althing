# 019 · Jarl: a note can be retracted like a row, and a retracted note is hidden from what a worker reads

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/019-retract-a-note
**Worker:** w-jarl-019-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-019
**Since:** 2026-11-03 10:17

## What
Two notes on an unstarted issue had to be withdrawn when the owner decided its future worker must not see their subject. retract <id> <n> refuses because only ran/saw rows are numbered, although the evidence tool's own retract field suggests otherwise. The only way out was to file the issue again and drop the old one.

## Why
What a worker is told must be correctable without renumbering the work around it.

## Acceptance
- Notes are numbered for retraction as rows are; retract takes a note back with who and why
- show keeps the retracted note struck through, and the view a worker reads leaves it out
- Tests for both

## Evidence

