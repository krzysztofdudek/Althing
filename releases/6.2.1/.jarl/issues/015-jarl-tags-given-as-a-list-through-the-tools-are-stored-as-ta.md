# 015 · Jarl: tags given as a list through the tools are stored as tags, never as the list's text

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/015-tool-list-fields
**Worker:** w-jarl-015-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-015
**Since:** 2026-11-03 06:05

## What
new through the tools with tags given as a list wrote the header Tags: ["drift", "processes"], so the issue carried the tags ["drift" and "processes"] and list --tag drift missed it; the same call took files as a list correctly. Found on fifteen issues of one loop.

## Why
A tag that does not match is an issue that falls out of every filtered view without a word.

## Acceptance
- Every list field of every tool takes a list and stores its items; a value that would store brackets or quotes as part of a tag is refused
- A test through the tool layer for tags, files and after

## Evidence

