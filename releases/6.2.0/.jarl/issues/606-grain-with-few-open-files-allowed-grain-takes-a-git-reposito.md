# 606 · Grain: with few open files allowed, Grain takes a git repository for a plain folder and leaves a large file out silently, and crashes with a few more

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1519-bhuz
**Tags:** grain
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Where:** w-169-takeover-fable, issue 169 (ulimit -n 24 to 39)
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What


## Why
A failure to start git must not change what Grain thinks the repository is; a silent wrong model is worse than a stop.

## Acceptance
[test] Under a low open-file limit Grain either answers as it does without the limit or stops with a message naming the limit, never treats a git repository as a plain folder, red before and green after · by: cd plugins/grain && npm test

## Evidence

