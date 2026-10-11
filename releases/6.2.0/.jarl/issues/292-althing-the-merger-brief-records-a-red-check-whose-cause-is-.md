# 292 · Althing: the merger brief records a red check whose cause is in the branch as a jarl round, not as a free-text note

**Status:** open
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** althing, docs, briefs
**Files:** Althing/releases/6.2.0/briefs/merger.md
**Repo:** ../..
**Found by:** jarl-architect
**Where:** Althing/releases/6.2.0/briefs/merger.md, One merge, step 7; the retro of research/2026-10-11-jarl-model-calibration-and-field-notes (finding for Althing briefs)

## What
The merger brief records a red check after a merge as a free-text note, so the 6.2.0 record holds no round at all in 2,062 log lines and the metric red after approve cannot be counted for any model. A red whose cause is in the branch is a jarl round: it charges the worker, which is what calibration needs, and starts the fix cycle through the loop's own mechanism.

## Why
A note is invisible to every view and metric; a round is counted, shown by report, and prints the takeover block after the third.

## Acceptance
- merger.md step 7 says: a red check whose cause is in the branch is recorded with jarl round <id> naming what failed; a red whose cause is outside the branch stays a note until 246 lands
- A rail check or test proves the template carries that step; yg check and npm test green

## Evidence

