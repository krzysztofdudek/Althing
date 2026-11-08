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

- **ran:** node --test --test-name-pattern='note that carries' tests/owner-quote.test.mjs (before the fix) · **saw:** fail 1: retract 1 note-1 --by owner is refused with 'a line written to the issue file (~~Ruling rule-a (by owner): ... the owner's words: ...~~) holds The owner's words ... which the record keeps only as the owner's quote'

