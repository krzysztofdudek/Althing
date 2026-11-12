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

## Changelog
- A lease is no longer reported as idle while its worker changes files in its worktree: the newest change to a file there counts as activity alongside commits, rows and log lines.

## Evidence

### Proof

- **ran (line de739beefe38):** cd skills/jarl/scripts && nice -n 15 timeout 1800 systemd-run --user --scope -p MemoryMax=12G npm test · **saw:** ℹ tests 1855 · ℹ pass 1833 · ℹ fail 0 · ℹ skipped 22; exit 0 (on commit 79fcc23's code; the new test files of each issue were red on the commit before its fix and green after)

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

Assumed: activity in the worktree is the newest modification time of any file or directory in it, the .git entry left out and node_modules not entered (its own time counts), reading at most 50000 entries; a worktree not on this machine adds nothing. The suite row above ran on commit f78533c of jarl/540-jarl-6-3-1; the one later commit, 79fcc23, changes only how a test names its worktree directory (the path module instead of a split on a slash), and that file passes alone.

