# 207 · Althing: ws status reads only the top-level counts of status --json, so on a loop that gets a profile through extend it prints undefined

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261108T1516-qeqb
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

### Notes

Dropped: absorbed by piece 5 (issue 229), landed

