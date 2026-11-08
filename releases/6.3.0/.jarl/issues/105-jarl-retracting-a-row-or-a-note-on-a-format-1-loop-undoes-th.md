# 105 · Jarl: retracting a row or a note on a format-1 loop undoes the raise's rewrite of that issue's Repo field

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-019-opus
**Where:** Review of 019 (2026-11-03): lib/evidence.mjs
**Branch:** jarl/105-record-integrity
**Worker:** w-jarl-105-opus
**Worktree:** /home/me/Worktrees/JarlSkill/105-record-integrity
**Since:** 2026-11-06 22:43

## What
On a format-1 loop, retracting a row or a note raises the format and rewrites a bare-word Repo path to ./<word>, then the retraction's own write puts the old Repo value back. Reproduced on both the release branch and 019's branch.

## Why
The raise's rewrite must stay in the issue file the retraction writes.

## Acceptance
After a retraction on a format-1 loop the issue's Repo field keeps the raised form, with a test

## Changelog
- Fixed: Taking back a review, a test result or a note in a loop that an older Jarl wrote no longer undoes the update of that task's repository field. Before, that one task kept the old form while every other task was updated.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/retract.test.mjs (release tip with the new test only) · **saw:** tests 19, pass 18, fail 1: a retraction that raises a format-1 loop keeps the raise's ./ form - a verdict: the retracted issue's Repo still reads tool
- **ran:** cd skills/jarl/scripts && node --test tests/retract.test.mjs tests/seams.test.mjs (at a938112) · **saw:** tests 35, pass 35, fail 0: a retracted verdict, row and note each leave Repo ./tool in the issue they write
- **ran:** a copy of the 6.3.0 loop (format 1): the driver files an issue with --repo tool and a row, then this branch's jarl.mjs retract <id> 1 --by jarl, before and after a938112 · **saw:** release tip: format 2 and the issue's Repo stays tool; a938112: format 2 and Repo ./tool
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at d6dd8ac) · **saw:** tests 1469, pass 1447, fail 0, cancelled 0, skipped 22; exit 0

