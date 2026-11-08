# 208 · Jarl: retract is refused for a ruling note that carries the owner's quote, so such a note cannot be retracted

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-194-opus
**Where:** retract, the owner's-words check
**Branch:** jarl/208-quote-and-comment-gaps
**Worker:** w-jarl-208-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/208-quote-and-comment-gaps
**Since:** 2026-11-08 15:36

## What
retract <id> note-<n> is refused for a ruling note that carries the owner's quote, because of the owner's-words check, so the note stays.

## Why
A note written by mistake or superseded should be retractable by whoever may retract it.

## Acceptance
a ruling note with an owner's quote can be retracted by the owner's word, and the check still refuses an agent that invents a quote

## Evidence

