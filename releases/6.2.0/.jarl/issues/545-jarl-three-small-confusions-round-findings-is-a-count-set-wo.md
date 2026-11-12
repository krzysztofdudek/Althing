# 545 · Jarl: three small confusions: round --findings is a count, set --worktree is accepted and dropped, and an owner ruling with no question always prints a note

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** light
**Key:** 20261111T0927-ulyr
**Tags:** jarl, jarl-6.3.1, record
**Files:** 
**Repo:** JarlSkill
**Found by:** field-report
**Where:** round, set, decide
**Branch:** jarl/540-jarl-6-3-1
**Worker:** w-540-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 04:36

## What
A field report.

## Why
Each one makes a caller think something happened that did not.

## Acceptance
[read] Each of the three is renamed, refused or made quiet, with the reason in the issue

## Changelog
- round counts its findings with --finding-count <n>; the old --findings is refused with the call that does the same.
- set --worktree says whether it checked the path: a path that is not on this machine is not checked, and the note says so instead of saying it was checked.
- decide --by owner with his words no longer prints a note about a missing question.

## Evidence

### Notes

Deferred: For Jarl 6.3.1, on the owner's word.

Reasons, one per confusion. (1) round --findings was a number named like the findings themselves: renamed to --finding-count, and --findings is refused with the call that does the same. (2) set --worktree is a check that records nothing, on purpose, since a lease is found through its branch; it is kept, because a path not yet created is allowed at the lease and the check is tested. What misled was the note, which said the path was checked also when it was not on this machine: the note now says which happened. It was not renamed or refused because a lease set before its worktree exists is a normal order of work. Assumed: this reading of 'accepted and dropped'. (3) A ruling by the owner with his words and no question behind it is how he is recorded, so the note about a missing question was noise on every such ruling: made quiet. The full suite ran green on commit f78533c of jarl/540-jarl-6-3-1 (1855 tests, 1833 passed, 0 failed, 22 skipped on their platform); the one later commit changes only how one test names its worktree directory.

