# 140 · Jarl: ask, log and decide pointed at a directory with no loop crash with a bare ENOENT, where set and field say no such issue

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096f-opus
**Where:** Review of 096 (rev-jarl-096f-opus), Outside the issue
**Branch:** jarl/128-fields-and-refusals
**Worker:** w-jarl-128-sonnet
**Worktree:** /Users/me/Worktrees/JarlSkill/128-fields-and-refusals
**Since:** 2026-11-05 13:37

## What
ask, log and decide run in a directory that holds no loop end with a bare ENOENT and no ready line; set, field and the other writes there say no such issue instead of no loop here. The behaviour was there before 096.

## Why
An agent that runs from the wrong directory should be told there is no loop and given the --root form.

## Acceptance
Every command that needs a loop says no loop is found here and ends with the form that names --root, with a test per writing command

## Changelog
- Fixed: every command that writes, run where no loop is found, now says there is no loop there and names --root as the way to point at one. Before, ask, log and decide stopped with a file error, and set, field and the others said there was no such issue.

## Evidence

- **ran:** node --test tests/no-loop.test.mjs on the code before the change · **saw:** 32 of 34 failed: ask, log and decide ended with a bare ENOENT, set and field with 'no such issue', the rest with their own wording
- **ran:** npm test in skills/jarl/scripts on the branch tip (TMPDIR in a mktemp folder); ask q in an empty directory with and without --root · **saw:** tests 1298, pass 1277 on the run before the final wording change (one failure then fixed: the wording now holds 'no .jarl/'); the 21 writing commands, resume and 3 tools each print 'no loop here: <dir> holds no .jarl/ — open one with …, or pass --root "<loop-root>"' and end with the init form carrying the call's root; list and status still read an empty loop

