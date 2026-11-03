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
- **ran:** correction of the first red row: node --test tests/list-fields.test.mjs on the unchanged code · **saw:** all 5 tests red (the earlier row's 6 and 1/4 counts were of an earlier draft of the test)
- **ran:** node --test tests/list-fields.test.mjs with the review fixes' tests on the previous source · **saw:** pass 4, fail 6 of 10: dash items, bracketed name, required fields, repo/settles/only, import lists, after text
- **ran:** same file after the fixes; npm test · **saw:** list-fields 10 of 10 green; suite 810 tests, 781 pass, 5 fail (the five README and prose tests)
- **ran:** files 528 a.mjs -- --root /x, and after 528 500 -- --root /x, on a copy of the 6.2.0 loop · **saw:** both refused: 'an item cannot start with -', with the bare -- hint, exit 1; new with repeated --tags and --files then list --tag drift finds it
- **ran:** npm test on the branch tip (final) · **saw:** 810 tests, 782 pass, 5 fail (the five README and prose tests); replaces the count in the row before
- **ran:** node --test tests/list-fields.test.mjs on the previous source, with the new tests · **saw:** fail 3 of 12: one-item list text stored, repo path refused a list, after/source text message
- **ran:** same file after the fix; npm test · **saw:** 12 of 12 green; suite 812 tests, 784 pass, 5 fail (the five README and prose tests)
- **ran:** files 528 '["a.mjs"]', source 528 '["core/r#a"]', files 528 '[1]' on a copy of the 6.2.0 loop · **saw:** the first two refused: 'parses as a list of strings', exit 1; the third stored [1] as a path

