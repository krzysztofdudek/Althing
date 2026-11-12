# 542 · Jarl: a supersession takes one slug and cannot be withdrawn

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261111T0927-nuvs
**Tags:** jarl, jarl-6.3.1, record
**Files:** 
**Repo:** JarlSkill
**Found by:** field-report
**Where:** decide --supersedes
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
A wrong slug can only be repaired by a further ruling, and retiring a chain takes one call per ruling. A field report.

## Why
A slip in the ledger cannot be undone.

## Acceptance
[test] --supersedes takes several slugs, and a supersession can be withdrawn with a logged reason · by: cd skills/jarl/scripts && npm test

## Changelog
- decide --supersedes takes several rulings in one call (a comma list, or the flag repeated) and marks them all or none. A supersession written by mistake is taken back with retract <slug> supersession "<why>" --by <who>: the ruling is in force again and the reason is kept in the record and the log.

## Evidence

### Proof

- **ran (line c66138828ae2):** cd skills/jarl/scripts && nice -n 15 timeout 1800 systemd-run --user --scope -p MemoryMax=12G npm test · **saw:** ℹ tests 1855 · ℹ pass 1833 · ℹ fail 0 · ℹ skipped 22; exit 0 (on commit 79fcc23's code; the new test files of each issue were red on the commit before its fix and green after)

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

Assumed: the withdrawal is retract <slug> supersession, since retract is the verb that takes a record back by an appended entry that says who and why; the ruling gets a Supersession withdrawn line and the log one line, nothing written is edited, and the superseding ruling stops counting the ruling among those it supersedes. A comma list, a repeated flag and a list in the tool all give several slugs, marked in one write or none. The suite row above ran on commit f78533c of jarl/540-jarl-6-3-1; the one later commit, 79fcc23, changes only how a test names its worktree directory (the path module instead of a split on a slash), and that file passes alone.

