# 080 · Jarl: models says a fresh clone of a committed loop with no issue yet holds no live loop

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 032
**Found by:** rev-jarl-032-opus
**Where:** Review of 032 (2026-11-03)
**Branch:** jarl/037-notes-and-defaults
**Worker:** w-jarl-037-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-037
**Since:** 2026-11-03 10:58

## What
On a fresh clone of a committed loop that has no issue yet, models prints that the checkout holds no live loop, before and after 032.

## Why
A coordinator reading it thinks the loop is missing.

## Acceptance
models on such a clone reports an empty live loop, with a test

## Evidence

