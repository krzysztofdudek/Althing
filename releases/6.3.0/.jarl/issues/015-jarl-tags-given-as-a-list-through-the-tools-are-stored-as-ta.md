# 015 · Jarl: tags given as a list through the tools are stored as tags, never as the list's text

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261028T0923-fpoc
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/015-tool-list-fields
**Merged:** 15ca39d in ../../../JarlSkill
**CI:** none

## What
new through the tools with tags given as a list wrote the header Tags: ["drift", "processes"], so the issue carried the tags ["drift" and "processes"] and list --tag drift missed it; the same call took files as a list correctly. Found on fifteen issues of one loop.

## Why
A tag that does not match is an issue that falls out of every filtered view without a word.

## Acceptance
- Every list field of every tool takes a list and stores its items; a value that would store brackets or quotes as part of a tag is refused
- A test through the tool layer for tags, files and after

## Changelog
- Fixed: Tags, files, issue numbers and the other lists can be given to the tools as a real list, and each item is stored on its own, so filtering by a tag finds the issue. A list typed out as text, in brackets with more than one item or with quotes, is refused with a message that says how to write it, and so is a tag or an issue number that holds a bracket or a quote mark, and any item that starts with a dash. A file name in brackets, such as [id], is kept as a path.

## Evidence

- **ran (history):** node --test tests/list-fields.test.mjs (before the change) · **saw:** pass 1, fail 4 of 5 tests: tags as a list refused by the adapter, list text stored; red
- **ran (history):** node --test tests/list-fields.test.mjs on the unchanged code, first version of the test (6 tests) · **saw:** fail 6 of 6: jarl_new refused tags as a list ('tags must be a string'), and a list written as text was accepted
- **ran (history):** node --test tests/list-fields.test.mjs after the change · **saw:** pass 5, fail 0
- **ran (history):** npm test in skills/jarl/scripts on the branch tip · **saw:** 805 tests, 777 pass, 5 fail: the five README and prose tests of issue 028, none touching this change
- **ran (history):** correction of the first red row: node --test tests/list-fields.test.mjs on the unchanged code · **saw:** all 5 tests red (the earlier row's 6 and 1/4 counts were of an earlier draft of the test)
- **ran (history):** node --test tests/list-fields.test.mjs with the review fixes' tests on the previous source · **saw:** pass 4, fail 6 of 10: dash items, bracketed name, required fields, repo/settles/only, import lists, after text
- **ran (history):** same file after the fixes; npm test · **saw:** list-fields 10 of 10 green; suite 810 tests, 781 pass, 5 fail (the five README and prose tests)
- **ran (history):** files 528 a.mjs -- --root /x, and after 528 500 -- --root /x, on a copy of the 6.2.0 loop · **saw:** both refused: 'an item cannot start with -', with the bare -- hint, exit 1; new with repeated --tags and --files then list --tag drift finds it
- **ran (history):** npm test on the branch tip (final) · **saw:** 810 tests, 782 pass, 5 fail (the five README and prose tests); replaces the count in the row before
- **ran (history):** node --test tests/list-fields.test.mjs on the previous source, with the new tests · **saw:** fail 3 of 12: one-item list text stored, repo path refused a list, after/source text message
- **ran (history):** same file after the fix; npm test · **saw:** 12 of 12 green; suite 812 tests, 784 pass, 5 fail (the five README and prose tests)
- **ran (history):** files 528 '["a.mjs"]', source 528 '["core/r#a"]', files 528 '[1]' on a copy of the 6.2.0 loop · **saw:** the first two refused: 'parses as a list of strings', exit 1; the third stored [1] as a path
- **ran (history):** node --test tests/list-fields.test.mjs (the rewritten file, one rule for every list field) on the release/6.2.1 source · **saw:** tests 11, pass 2, fail 9: tool lists refused (must be a string), list text stored, -x stored, no list-text or dash rule message; the two passing tests are the release's CLI spellings and removing a tag stored with brackets, kept as guards
- **ran (history):** same file on the branch tip 85bf31f · **saw:** tests 11, pass 11, fail 0
- **ran (history):** npm test in skills/jarl/scripts on 85bf31f · **saw:** tests 811, pass 788, fail 0
- **ran (history):** on a copy of the 6.2.0 loop: files 528 '[a.mjs, b.mjs]', source 528 '[core/r#a, core/r#b]', new --tags '["drift", "processes"]', files 527 "'a.mjs'", tag 527 +it's, after 527 '[1]', release code then branch · **saw:** release: all stored with brackets or quotes (Files: [a.mjs, b.mjs], Tags: ["drift", "processes"]); branch: each refused, exit 1, naming the field and the rule; files 528 a.mjs -- --root /x refused with the bare -- hint; files 528 'src/[id]/page.tsx,[1],[...slug]' b.mjs stored four paths; new --tags drift --tags processes then list --tag drift finds it
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 819, pass 796, fail 0, skipped 23 (merge 15ca39d on release/6.2.1, with the changelog wording corrected in 2c2e7ff after the approve)

