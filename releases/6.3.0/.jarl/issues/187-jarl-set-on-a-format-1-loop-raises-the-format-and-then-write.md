# 187 · Jarl: set on a format-1 loop raises the format and then writes the issue back with the bare Repo value, the flaw issue 105 fixed for retraction

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-105-opus-g1
**Where:** skills/jarl/scripts/lib/commands.mjs cmdSet
**Branch:** jarl/187-writes-and-gaps
**Worker:** w-jarl-187-opus
**Worktree:** /home/me/Worktrees/JarlSkill/187-writes-and-gaps
**Since:** 2026-11-08 08:13

## What
set <id> <status> --by <who> on a format-1 loop raises the record format to 3 and then the set's own write puts the old bare Repo path back on the issue it writes. The base does the same.

## Why
The raise's rewrite must stay in the issue file the command writes.

## Acceptance
After set on a format-1 loop the issue's Repo keeps the raised form, for every command that raises the format and then writes an issue, with a test per command

## Changelog
- Fixed: Moving a task to another status with your name given, in a loop an older Jarl wrote, no longer undoes the update of that task's repository field. Before, the moved task kept the old form.

## Evidence

- **ran:** node --test tests/raise-keeps-paths.test.mjs (on the release branch's cmdSet, before the fix) · **saw:** pass 12 fail 3: set with --by, set into a status that needs a reason with --by, and set done with --by each left the moved issue's Repo as the bare tool while the raise wrote the other issue ./tool
- **ran:** node --test tests/raise-keeps-paths.test.mjs (at a2d547a) · **saw:** pass 15 fail 0: set, evidence, merged, round, ask, new, field Acceptance, Parent and Kind, decide --waives-review, a bot review and a review of several issues each keep ./tool in the issue they write after raising a format-1 loop

