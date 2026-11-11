# 640 · Grain: grain rules names no unread file on a one-module repository, Vue and Svelte dependency reads swallow their errors, and measure.mjs and commit-tree.mjs start git outside every oracle node

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1922-iqgq
**Tags:** grain
**Files:** 
**Repo:** Grain
**After:** 573
**Found by:** jarl
**Where:** w-573-fable, the Grain large-files package
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What


## Why
The same gaps 587 and 605 closed elsewhere: a user is not told which files were not read, a Vue or Svelte file whose read throws counts as having no dependencies, and two files that start git escape the rule that guards it.

## Acceptance
[test] grain rules names unparsed and unread files on a one-module repository; a Vue or Svelte file whose dependency read throws is named under dependencies not read and read again by grain refresh; the oracle maps measure.mjs and commit-tree.mjs, each red before and green after · by: cd plugins/grain && npm test

## Evidence

