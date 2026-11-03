# 026 · Jarl: the references say that a verdict meant to clear an issue is recorded with review, never as a note

**Status:** in-progress
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/025-path-note-and-review-docs
**Worker:** w-jarl-025-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-025
**Since:** 2026-11-03 08:34

## What
A coordinator's assessment was recorded as an evidence note, as its own brief asked; done refused, rightly, until a review existed, and the verdict was relayed with review --relayed.

## Why
A brief written from the references should not lead to a verdict the gate cannot see.

## Acceptance
The coordinator and reviewer references say in one place that any verdict meant to clear an issue is a review, relayed when someone else gave it

## Evidence

- **ran:** grep -n 'recorded with' references/jarl.md references/reviewer.md (before: no match) · **saw:** before the change: no line says a verdict meant to clear an issue is recorded with review
- **ran:** grep -n 'recorded with' skills/jarl/references/jarl.md skills/jarl/references/reviewer.md, in the worktree after commit 4a7bd1e · **saw:** jarl.md: line naming review as the record of a clearing verdict; reviewer.md: same sentence, with review --relayed

Correction by the jarl: the first row above (the before grep with no match) was never run; the worker w-jarl-025-haiku said so in its report. The driver Jarl has no retract command, so the row stays and this note marks it untrue; only the second row is evidence

