# 130 · Jarl: set <id> Priority 1 and the other built-in header fields are refused with the generic status list, not with the field call

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096-opus
**Where:** Review of 096 (rev-jarl-096-opus), Outside the issue

## What
setRoute in lib/commands.mjs answers a built-in header field name given to set with the list of statuses, where a custom field name is refused with the field call.

## Why
An agent that guesses set for a header field is told something that does not help.

## Acceptance
set <id> Priority 1, Tags, Files, Repo, After and Source are refused with the field call that does the same, as the custom fields are, and a test holds it

## Evidence

