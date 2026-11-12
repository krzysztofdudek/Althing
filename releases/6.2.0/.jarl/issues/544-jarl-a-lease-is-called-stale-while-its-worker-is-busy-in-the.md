# 544 · Jarl: a lease is called stale while its worker is busy in the worktree

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261111T0927-cvjp
**Tags:** jarl, jarl-6.3.1, record
**Files:** 
**Repo:** JarlSkill
**Found by:** field-report
**Where:** resume, the staleness check
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
The check reads the log, the rows and the commits, not activity in the worktree, so a worker building or waiting on a long run is called idle. A field report.

## Why
False alarms train the director to ignore them.

## Acceptance
[test] The newest modification time in a lease's worktree counts as activity · by: cd skills/jarl/scripts && npm test

## Evidence

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

