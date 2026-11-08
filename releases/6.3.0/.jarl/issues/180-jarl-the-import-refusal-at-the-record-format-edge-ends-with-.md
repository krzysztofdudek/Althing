# 180 · Jarl: the import refusal at the record format edge ends with the dry-run form, which only repeats the refusal, and the library import can file issues and then refuse an empty by under --parent

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-094-opus-h1b
**Where:** skills/jarl/scripts/lib/import.mjs formOf and cmdImport
**Branch:** jarl/173-views-and-refusals
**Worker:** w-jarl-173-opus
**Worktree:** /home/me/Worktrees/JarlSkill/173-views-and-refusals
**Since:** 2026-11-08 10:11

## What
(1) The refusal for a number the loop's record format cannot hold ends with the import --dry-run form, which only repeats it; the way out is --only or raising the format. (2) A library caller of cmdImport that passes --parent with an empty by gets the issues filed and then a refusal when they are put under the parent; the command line and the MCP tool refuse an empty by before the command runs.

## Why
A form at the end of a refusal should be one that can work; a refused import leaves nothing.

## Acceptance
The refusal at the format edge ends with a form that can work or says the way out; cmdImport refuses an empty by with --parent before the first write; a test for each

## Evidence

