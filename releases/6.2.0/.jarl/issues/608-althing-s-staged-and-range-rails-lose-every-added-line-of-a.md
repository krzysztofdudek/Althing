# 608 · Althing's staged and range rails lose every added line of a file after an added line that begins wi…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1536-jeew
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-363b-opus
**Where:** the review of 363
**Branch:** jarl/592-names-gate
**Worker:** w-592-fable
**Model:** claude-fable-5-2@high
**Since:** 2026-11-11 18:24

## What
Althing's staged and range rails lose every added line of a file after an added line that begins with "++ ", because addedLines in rails/git.mjs takes any "+++ " line for a file header

## Why


## Acceptance


[test] Althing's staged and range rails read every added line of a file after an added line that begins with '++ ' (headers told by position), red before and green after · by: yg check && npm test

## Evidence

