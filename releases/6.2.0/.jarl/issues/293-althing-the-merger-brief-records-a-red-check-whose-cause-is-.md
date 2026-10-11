# 293 · Althing: the merger brief records a red check whose cause is outside the branch with merged --red, once 246 lands, so the log shows what was red and why

**Status:** open
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** althing, docs, briefs
**Files:** Althing/releases/6.2.0/briefs/merger.md
**Repo:** ../..
**After:** 246, 292
**Found by:** jarl-architect
**Where:** Althing/releases/6.2.0/briefs/merger.md, One merge, step 7; the retro of research/2026-10-11-jarl-model-calibration-and-field-notes

## What
After 246 Jarl records a merged branch whose gate is red as merged --red <id>, with the cause tracked by its own issue, and an outside red is not a round. The merger brief still says to write a free-text note, so the log has no rounds and no red marks: it shows nothing of what was red after a merge or why.

## Why
A red from outside the branch must stay visible without charging a worker; merged --red is the record that does that.

## Acceptance
- merger.md step 7 says: a red whose cause is outside the branch is recorded with merged --red <id> and the issue that tracks the cause; no free-text note stands in for either record
- A rail check or test proves the template carries that step; yg check and npm test green

## Evidence

