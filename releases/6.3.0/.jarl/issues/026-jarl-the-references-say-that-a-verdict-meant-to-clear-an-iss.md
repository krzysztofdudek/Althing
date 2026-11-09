# 026 · Jarl: the references say that a verdict meant to clear an issue is recorded with review, never as a note

**Status:** done
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Key:** 20261028T0924-thwh
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/025-path-note-and-review-docs
**Merged:** 9503db5 in ../../../JarlSkill
**CI:** none

## What
A coordinator's assessment was recorded as an evidence note, as its own brief asked; done refused, rightly, until a review existed, and the verdict was relayed with review --relayed.

## Why
A brief written from the references should not lead to a verdict the gate cannot see.

## Acceptance
The coordinator and reviewer references say in one place that any verdict meant to clear an issue is a review, relayed when someone else gave it

## Evidence

- **ran (history):** grep -n 'recorded with' references/jarl.md references/reviewer.md (before: no match) · **saw:** before the change: no line says a verdict meant to clear an issue is recorded with review
- **ran (history):** grep -n 'recorded with' skills/jarl/references/jarl.md skills/jarl/references/reviewer.md, in the worktree after commit 4a7bd1e · **saw:** jarl.md: line naming review as the record of a clearing verdict; reviewer.md: same sentence, with review --relayed

Correction by the jarl: the first row above (the before grep with no match) was never run; the worker w-jarl-025-haiku said so in its report. The driver Jarl has no retract command, so the row stays and this note marks it untrue; only the second row is evidence
- **ran (history):** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** ℹ tests 834 ℹ pass 811 ℹ fail 0 (on 9503db5, release/6.2.1: 032 merged at 2399fe2, 025 and 026 at 9503db5)

