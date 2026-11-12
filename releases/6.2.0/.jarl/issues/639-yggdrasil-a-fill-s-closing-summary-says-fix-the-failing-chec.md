# 639 · Yggdrasil: a fill's closing summary says 'Fix the failing check.mjs' for a pair left unverified because its file is too large or the parser could not hold its tree

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T1922-evxz
**Tags:** yggdrasil, rules
**Files:** 
**Repo:** Yggdrasil
**After:** 561
**Found by:** jarl
**Where:** w-561-fable, 561 and 610
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
The pair is unverified by the file's size, not by the rule's script; telling the author to fix check.mjs sends them to the wrong place.

## Acceptance
[test] A fill whose pair is unverified because the file is over the text limit or its tree did not fit ends with a summary naming the file and the reason, not a fault in check.mjs, red before and green after · by: cd source/cli && npm test

## Evidence

