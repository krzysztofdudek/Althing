# 540 · Jarl: decide --applies-to accepts a selector that matches nothing

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T0927-htuf
**Tags:** jarl, jarl-6.3.1, record
**Files:** 
**Repo:** JarlSkill
**Found by:** field-report
**Where:** skills/jarl/scripts/lib/rules.mjs
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
A rule scoped 'role worker and repo ./repo' was accepted and reached no brief, because the selector is compared with the repository's declared name and the issue prints the path spelling. A field report.

## Why
A rule that silently reaches nobody looks in force.

## Acceptance
[test] decide refuses a repo selector no declared repository has, and the path and the name spellings both match · by: cd skills/jarl/scripts && npm test

## Changelog
- A rule scoped to a repository (decide --applies-to "repo <name-or-path>") reaches the issues that name that repository whether the rule and the issue write it as a name or as a path, and decide refuses a repository the loop does not know instead of saving a rule that reaches nobody.

## Evidence

### Proof

- **ran (line 21b5d1188f3a):** cd skills/jarl/scripts && nice -n 15 timeout 1800 systemd-run --user --scope -p MemoryMax=12G npm test · **saw:** ℹ tests 1855 · ℹ pass 1833 · ℹ fail 0 · ℹ skipped 22; exit 0 (on commit 79fcc23's code; the new test files of each issue were red on the commit before its fix and green after)

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

Assumed: a repo selector is a known repository when a repository of that name is declared in the loop or an issue names it (the loop's own included); a name and every path into the same checkout reduce to one label, so the selector and the issue's Repo field meet in either spelling. The suite row above ran on commit f78533c of jarl/540-jarl-6-3-1; the one later commit, 79fcc23, changes only how a test names its worktree directory (the path module instead of a split on a slash), and that file passes alone.

