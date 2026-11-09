# 161 · Althing: lines 5 to 10 of the 6.3.0 loop's log are undated Check lines that verify flags

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261105T1151-buuo
**Tags:** 
**Files:** 
**Repo:** ../..
**Found by:** rev-jarl-098-opus
**Where:** Review of 098 (rev-jarl-098-opus), Outside the issue

## What
releases/6.3.0/.jarl/log.md lines 5 to 10 are 'Check:' lines with no date; verify flags them at release/6.2.1 and at the tip. They predate the work of this session (probably the goal's Check lines copied into the log by the server session's setup).

## Why
verify exits 2 on a loop that is otherwise sound, which would hide a real finding.

## Acceptance
verify on the loop is clean, by a retraction or a goal command (never a hand edit of the log), or the lines are explained as the goal's own and verify is taught to read them

## Evidence

### Notes

Dropped: absorbed by piece 5 (issue 229), landed

