# 018 · Jarl: an after naming an issue that does not exist is refused before any number is taken

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/012-new-refuses-unknown
**Worker:** w-jarl-012-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-012
**Since:** 2026-11-03 08:34

## What
Filing several issues in parallel, one new named an after issue that did not exist yet and was refused; the next filing took its number, and every later reference was off by one until fixed by hand.

## Why
A refused call must leave the record as it was, numbers included.

## Acceptance
- new checks every after reference before it takes a number, and a refusal takes none
- A test with a refused filing followed by a second filing

## Evidence

- **ran:** jarl new --after 99999 on a copy of this loop, then new with a valid call; MCP jarl_new after 2 then two filings · **saw:** refused with no such issue, nothing written, next filing took the next free number. Not reproducible; test added, green before and after

