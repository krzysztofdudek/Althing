# 605 · Grain: an ordinary file whose extractor throws is kept as having no relations until its stamp changes

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1519-juib
**Tags:** grain, relations
**Files:** 
**Repo:** Grain
**After:** 169
**Found by:** jarl
**Where:** w-169-takeover-fable, issue 169
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What


## Why
An extractor exception depends on the code that ran, not on the file; keeping it as the file's answer hides the file's dependencies after the extractor is fixed or the moment passes.

## Acceptance
[test] A file under the parse limit whose extraction throws is reported as unread with the reason and read again by grain refresh, red before and green after · by: cd plugins/grain && npm test

## Evidence

