# 066 · Jarl: the takeover limit is fixed at three rounds

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-ce9878f6
**Where:** JarlSkill/skills/jarl/scripts/lib/base.mjs (ROUNDS_BEFORE_TAKEOVER), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:25 at a1132a8
**Branch:** jarl/066-takeover-limit
**Worker:** w-jarl-066-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-066
**Since:** 2026-11-03 12:44

## What
Claim: Format and visual work could take over after two rounds, where each round is costly to verify.

ROUNDS_BEFORE_TAKEOVER is a constant of 3. Map row fr-34.

## Why


## Acceptance
- A profile may set, per kind, the number of red rounds after which round prints the takeover block; a loop without it keeps 3
- Tests for a kind with 2 and for the default

## Evidence

Kept small by the model (report section 11): a goal or profile line sets the round limit per kind, read by the takeover row; acceptance as filed.

Correction to the note above: the limit is a profile line per kind, as the acceptance says, not a goal line.

