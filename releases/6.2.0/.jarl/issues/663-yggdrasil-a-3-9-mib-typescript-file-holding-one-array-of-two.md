# 663 · Yggdrasil: a 3.9 MiB TypeScript file holding one array of two million numbers keeps a plain yg check busy for over four minutes

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T2138-uhgs
**Tags:** yggdrasil, performance
**Files:** 
**Repo:** Yggdrasil
**After:** 561
**Found by:** jarl
**Where:** w-561-fable, 561 round 2 report

## What


## Why
A generated data file of a few megabytes is common in real repositories; a check that sits for minutes on one looks hung, and nothing tells the user which file holds it.

## Acceptance
[test] yg check on a repository holding a 3.9 MiB TypeScript file of one array of two million numbers ends within a bound the test states, or names the file it is slow on, red before and green after · by: cd source/cli && npm test

## Evidence

