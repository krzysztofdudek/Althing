# 541 · Jarl: no view of the rules that reach a role

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261111T0927-xhmw
**Tags:** jarl, jarl-6.3.1, record
**Files:** 
**Repo:** JarlSkill
**Found by:** field-report
**Where:** decisions --live
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
decisions --live has no --as or --applies-to filter, so checking a new rule means raising a brief by hand. A field report.

## Why
A rule cannot be checked before use.

## Acceptance
[test] decisions --live --as <role> prints the rules that reach that role · by: cd skills/jarl/scripts && npm test

## Changelog
- decisions --as <role> lists the rulings that are rules reaching that role (with --live, only those still in force), so a new rule can be checked before any brief is raised.

## Evidence

### Proof

- **ran (line da84b8e19444):** cd skills/jarl/scripts && nice -n 15 timeout 1800 systemd-run --user --scope -p MemoryMax=12G npm test · **saw:** ℹ tests 1855 · ℹ pass 1833 · ℹ fail 0 · ℹ skipped 22; exit 0 (on commit 79fcc23's code; the new test files of each issue were red on the commit before its fix and green after)

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

Assumed: decisions --as <role> keeps the rulings that are rules whose role selector is absent or is that role; a moment, slice or issue selector does not keep a rule out, since it reaches the role on the work it matches. Jarl's own role rules are not rulings and are not listed. The suite row above ran on commit f78533c of jarl/540-jarl-6-3-1; the one later commit, 79fcc23, changes only how a test names its worktree directory (the path module instead of a split on a slash), and that file passes alone.

