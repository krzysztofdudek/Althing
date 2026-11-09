# 220 · Jarl: only worker leases are recorded, so a replaced coordinator cannot tell whether a worker is alive and a compacted holder can raise a second merger into the same checkout

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** simulation
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** opus-simulation-2026-11-08
**Where:** lease and liveness, references/jarl.md One merger for the loop

## What
Coordinators, reviewers and the merger leave no trace until they write. The merger's report is the only signal that the main checkout is free and lives only in the holder's context. A design question for the owner: record raised agents with role, model and last sign of life, and a merge lease on the main checkout. Found by an Opus simulation.

## Why


## Acceptance
decide with the owner whether 6.3.0 records raised agents, or says in the known limitations that it does not

## Evidence

Dropped: absorbed by piece 4 (issue 228), landed

