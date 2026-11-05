# 130 · Jarl: set <id> Priority 1 and the other built-in header fields are refused with the generic status list, not with the field call

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096-opus
**Where:** Review of 096 (rev-jarl-096-opus), Outside the issue
**Branch:** jarl/128-fields-and-refusals
**Worker:** w-jarl-128-sonnet
**Worktree:** /Users/me/Worktrees/JarlSkill/128-fields-and-refusals
**Since:** 2026-11-05 13:37

## What
setRoute in lib/commands.mjs answers a built-in header field name given to set with the list of statuses, where a custom field name is refused with the field call.

## Why
An agent that guesses set for a header field is told something that does not help.

## Acceptance
set <id> Priority 1, Tags, Files, Repo, After and Source are refused with the field call that does the same, as the custom fields are, and a test holds it

## Changelog
- Fixed: set given the name of an issue's own field, such as Priority, Tags, Files, Repo, After or Source, now says it is a field and ends with the field call that writes it, as it does for a field the profile declares. Before, it listed the statuses.

## Evidence

- **ran:** node --test tests/grammar.test.mjs on the code before the change · **saw:** 2 failed: set 1 Priority and set 1 Files answered 'status must be one of: open, in-progress, done, dropped, deferred (got ...)' where the field call was expected
- **ran:** node --test tests/grammar.test.mjs tests/profile.test.mjs tests/surface.test.mjs after the change; set 130 Priority 1 (also Tags, Files, Repo, After, Source, Kind, Found by) on a copy of the real loop · **saw:** pass, fail 0; each refused with '<Name> is a field, not a status: field writes it' ending with the jarl.mjs field form and the call's --root

