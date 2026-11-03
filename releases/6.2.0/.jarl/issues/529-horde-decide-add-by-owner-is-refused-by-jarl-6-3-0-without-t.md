# 529 · Horde: decide add --by owner is refused by Jarl 6.3.0 without the owner's words, and Horde has no way to pass them

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** horde, jarl
**Files:** 
**Repo:** ../../../Horde
**Found by:** rev-jarl-005-opus
**Where:** Review of Jarl 6.3.0 issue 005 (2026-11-03): Horde passes --by to decide (default director); Jarl 6.3.0 refuses --by owner without --quote

## What
When Horde vendors Jarl 6.3.0, its decide add --by owner path would be refused, because a ruling by the owner must now carry his own words and Horde's command has no quote option.

## Why
A Horde mission could not record the owner's ruling at all.

## Acceptance
Horde's decide add takes the owner's words and passes them on, with a test against the vendored Jarl 6.3.0

## Evidence

From 083 (2026-11-03): Jarl 6.3.0 exports RECORD_API as jarl-record/2 with RECORD_APIS listing the versions it speaks; Horde checks RECORD_API === 'jarl-record/1' exactly (loop.mjs), so when Horde re-vendors Jarl 6.3.0 it must check RECORD_APIS (or pin the /1 table) instead; Horde's decide add --by owner also needs the owner's words (this issue)

