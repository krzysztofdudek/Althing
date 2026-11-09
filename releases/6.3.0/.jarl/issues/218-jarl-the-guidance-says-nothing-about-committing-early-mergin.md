# 218 · Jarl: the guidance says nothing about committing early, merging as approvals arrive, how many workers at once, how to cut slices, when coordinators pay off, or whether a round goes to the same worker or a fresh one

**Status:** dropped
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** simulation
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** opus-simulation-2026-11-08
**Where:** references/jarl.md, worker.md, merger.md

## What
An Opus simulation found that: a worker thinking for a long time looks idle because liveness reads commits and rows and worker.md never says to commit at the failing-test and passing stages; with Merger: jarl approved branches wait while the jarl waits on coordinators; step 4 and step 6 and the changes reply disagree on same or fresh worker per round; the takeover worker is told to stop on a dirty worktree, which is the work it was raised to finish. Belongs with issue 209 and under the word budget of issue 088.

## Why


## Acceptance
each of the points is said once in the guidance, in the fewest words, or on the known-limitations list with its reason

## Evidence

Dropped: absorbed by piece 4 (issue 228), landed

