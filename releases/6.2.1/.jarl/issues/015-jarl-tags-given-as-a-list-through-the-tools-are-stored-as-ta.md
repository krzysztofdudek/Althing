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

## Changelog
- Fixed: tags, files and issue lists given as a list through the tools are stored item by item, so filtering by a tag finds the issue. A list written out as text, with brackets or quotes, is refused.

## Evidence

- **ran:** node --test tests/list-fields.test.mjs (before the change) · **saw:** pass 1, fail 4 of 5 tests: tags as a list refused by the adapter, list text stored; red
- **ran:** node --test tests/list-fields.test.mjs on the unchanged code, first version of the test (6 tests) · **saw:** fail 6 of 6: jarl_new refused tags as a list ('tags must be a string'), and a list written as text was accepted
- **ran:** node --test tests/list-fields.test.mjs after the change · **saw:** pass 5, fail 0
- **ran:** npm test in skills/jarl/scripts on the branch tip · **saw:** 805 tests, 777 pass, 5 fail: the five README and prose tests of issue 028, none touching this change

