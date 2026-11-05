# 145 · Jarl: MCP input refusals end with no form, and list accepts a status, kind or priority it does not know

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096h-opus
**Where:** Review of 096 (rev-jarl-096h-opus), Outside the issue

## What
A tool call whose root or path field is not absolute, whose field is unknown or whose type is wrong is refused with no form of the call. list --status bogus, --kind task and --prio 7 print (none) and exit 0 instead of refusing. Both were there before 096.

## Why
An agent that mistypes a filter should be told the allowed values, not shown an empty list.

## Acceptance
Every MCP input refusal ends with the tool's form with a registered placeholder, and list refuses an unknown status, kind or priority naming the allowed values; a test holds each

## Evidence

