# 187 · Jarl: set on a format-1 loop raises the format and then writes the issue back with the bare Repo value, the flaw issue 105 fixed for retraction

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-105-opus-g1
**Where:** skills/jarl/scripts/lib/commands.mjs cmdSet

## What
set <id> <status> --by <who> on a format-1 loop raises the record format to 3 and then the set's own write puts the old bare Repo path back on the issue it writes. The base does the same.

## Why
The raise's rewrite must stay in the issue file the command writes.

## Acceptance
After set on a format-1 loop the issue's Repo keeps the raised form, for every command that raises the format and then writes an issue, with a test per command

## Evidence

