# 663 · Yggdrasil: a 3.9 MiB TypeScript file holding one array of two million numbers keeps a plain yg check busy for over four minutes

**Status:** in-progress
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
**Branch:** jarl/560-memory-rest
**Worker:** w-560-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
A generated data file of a few megabytes is common in real repositories; a check that sits for minutes on one looks hung, and nothing tells the user which file holds it.

## Acceptance
[test] yg check on a repository holding a 3.9 MiB TypeScript file of one array of two million numbers ends within a bound the test states, or names the file it is slow on, red before and green after · by: cd source/cli && npm test

## Evidence

### Notes

Assumed: the fault does not hold on release/6.2.0 (tip d2cc7b6af, with 340 and 561 merged), so nothing is changed for it. Tried: a mapped src/data/numbers.ts of one array of 2,000,000 one-digit numbers (4,000,023 bytes, 3.8 MiB), plain yg check --json, in a scratch repository, with and without git, with and without another node importing it, sizes 0.4 / 1 / 2 / 4 MB: 0.86 s, 1.7 s, 3.2 s, 6.2 s (linear, about 1.5 s per MB), a second run 0.18 s from the content-addressed fact cache. The time of the first run is spent in the relation pass's per-file child process (parse and fact extraction); the main thread is idle in spawnSync. No four-minute case was seen.

