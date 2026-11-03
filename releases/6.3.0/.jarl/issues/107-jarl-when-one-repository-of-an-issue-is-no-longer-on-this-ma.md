# 107 · Jarl: when one repository of an issue is no longer on this machine, recording another repository's merge gives a false 'approved on another tip' note

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 055
**Found by:** rev-jarl-055d-opus
**Where:** Review of 055 (2026-11-03): merged note, lib/commands.mjs

## What
If one repository of a multi-repository issue is no longer on this machine, recording the merge of another repository gives the note even when nothing moved.

## Why
A note that says a tip moved must be true; a missing repository means the note stays silent for it.

## Acceptance
A repository missing on this machine keeps the note silent for the others, with a test

## Evidence

