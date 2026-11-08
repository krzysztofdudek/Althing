# 191 · Jarl: three wording and refusal gaps in the tick take-back and the Where log found by the review of group G2

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-187-opus-g2
**Where:** jarl.mjs dispatchCall retract; lib/owner-lines.mjs cmdRetractTick; lib/commands.mjs fieldLine
**Branch:** jarl/122-wording-and-canon
**Worker:** w-jarl-122-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/122-wording-and-canon
**Since:** 2026-11-08 10:28

## What
(1) Every refusal of a tick take-back ends with the generic retract form whose placeholder never names tick-<n>. (2) The refusal on a closed issue says a tick is taken back once it is open again, but reopening already voids every tick. (3) A Where change still logs the whole new value.

## Why
A refusal should end with the form that fits, say what is true, and a long Where should not flood the log tail.

## Acceptance
The take-back refusals end with a form that names tick-<n>, the closed-issue wording is true, a Where change logs a bounded excerpt of the new value too, and a test holds each

## Evidence

