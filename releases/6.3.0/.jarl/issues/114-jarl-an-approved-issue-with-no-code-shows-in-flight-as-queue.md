# 114 · Jarl: an approved issue with no code shows in flight as 'queued for the merge' while the merge queue lists nothing

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 039
**Found by:** rev-jarl-039b-opus
**Where:** Review of 039 (2026-11-03): lib/evidence.mjs IN_FLIGHT_MARKS.approved
**Branch:** jarl/074-merge-and-files
**Worker:** w-jarl-074-sonnet
**Worktree:** /Users/me/Worktrees/JarlSkill/074-merge-and-files
**Since:** 2026-11-05 13:37

## What
An issue that carries no code and is approved shows in the in-flight view as queued for the merge, but queue lists nothing for it.

## Why
The two views must agree on what waits for a merger.

## Acceptance
In flight and queue agree for an approved issue with no code, with a test

## Changelog
- Fixed: A task that is approved and carries no code is no longer shown as queued for the merge in the status and the resume, where the merge queue never lists it; they say that no merge waits and that it is ready to be set done.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/next-views.test.mjs, new test, lib/ before the fix · **saw:** fail 1: the queue is empty for both issues but status prints 'in flight 1 · approved and queued for the merge' for the issue with no branch
- **ran:** cd skills/jarl/scripts && node --test tests/next-views.test.mjs tests/owner-sign-off.test.mjs tests/resume.test.mjs tests/docs-true.test.mjs tests/printed-texts.test.mjs, on the branch · **saw:** pass 59, fail 0: the no-code issue reads 'approved, and it carries no code, so no merge waits — next set it done', the code issue keeps 'approved and queued', the mark stays approved

