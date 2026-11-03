# 047 · Jarl: field with prio does not name the prio command

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-861786af
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdField), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:1796 at a1132a8
**After:** 029

## What
Claim: field <id> prio fails and the right name has to be looked up in help.

field 529 prio 1 printed 'prio is not a field: Resources, or one this loop's profile declares'. Map row fr-12; issue 029 covers part of it.

## Why


## Acceptance
- field <id> <name>, for a header field that has its own command (Priority, Tags, Files, Repo, After), is refused with that command written out
- A test for each of those fields; folded into 029 if 029's edit command already covers it, with a note saying so

## Evidence

