# 154 · Jarl: brief --slice lists coordinator rules for all moments where next --as lists them by the moment of its own rows, and a dropped issue's reviewer brief says its proof is missing

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-058-opus
**Where:** Review of 058 (rev-jarl-058-opus), Outside the issue

## What
(1) brief --slice matches the coordinator rules for all six moments (lib/brief.mjs:19,75) while next --as matches only the moments of its own rows (lib/ball.mjs:482), so the same coordinator sees two different rule lists. (2) A reviewer's brief for a dropped issue carries the note that it holds no proof row and that a worker's missing rows are an Important finding (lib/brief.mjs:59), which does not apply to a dropped issue.

## Why
One matcher should give one answer; a note that does not apply teaches the reader to skip notes.

## Acceptance
brief --slice and next --as give a coordinator the same rules for the same moment, or the docs say why they differ; a dropped issue's reviewer brief does not carry the missing-proof note; tests for both

## Evidence

