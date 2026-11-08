# 207 · Althing: ws status reads only the top-level counts of status --json, so on a loop that gets a profile through extend it prints undefined

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Found by:** w-jarl-203-opus
**Where:** workspace/ws.mjs status

## What
After extend a loop reads as profile custom and status --json nests its counts under statuses (issue 203). ws status reads only the top-level counts and would print undefined for such a loop.

## Why


## Acceptance
ws status prints the counts of a loop whose status --json nests them under statuses, and of one that does not

## Evidence

