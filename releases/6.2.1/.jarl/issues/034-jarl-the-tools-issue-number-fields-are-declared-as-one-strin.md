# 034 · Jarl: the tools' issue-number fields are declared as one string though they take lists, and tag +a,b stores one tag written a,b

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 015
**Found by:** rev-jarl-015d-opus
**Where:** Review of 015 after its takeover (2026-11-03)

## What
The ids and id fields of the tools accept a list and refuse list text, but their declared schema type stays string, so a client reading the schema sends text. tag +a,b stores one tag a,b, as it did before 015.

## Why
A schema that says string invites the list-as-text a call then refuses; a comma inside one tag is almost never meant.

## Acceptance
- The id-list fields declare a list in the tool schema (built in jarl-mcp, within what the vendored Runes adapter allows), with a test reading the schema
- tag +a,b adds two tags, or is refused with a message, with a test

## Evidence

