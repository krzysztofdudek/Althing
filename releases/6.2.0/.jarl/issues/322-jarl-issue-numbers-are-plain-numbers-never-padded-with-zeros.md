# 322 · Jarl: issue numbers are plain numbers, never padded with zeros; 7 and 007 are the same issue, a new issue is written without padding, an existing loop is untouched

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, ids
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/ids.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (the id grammar: ID_SRC, padId, cmpId)
**After:** 333
**Branch:** jarl/322-plain-ids
**Merged:** 43f73459126db6d28bceb62d9d32cbd8c70bae4e in ../../../JarlSkill
**CI:** pending

## What
The owner, 2026-10-18 (translated from Polish): Jarl should not format tickets with padding, it makes no sense, just the digits, all the more as they can exceed 1000. Package 2 of this release made numbers of 1000 and more work but kept padding below 1000 to three digits (007, 195). The rule becomes: an issue number is a plain number. A new issue is filed as 7, not 007: its file is 7-<slug>.md, its heading is # 7 · <title>, a question is a-7, a branch is jarl/7-<slug>. Every place that reads an id accepts digits with or without leading zeros and treats 007 and 7 as the same issue: lookups, After, ranges (7-12, 998-1002), comma lists, #7, the log, reviews, questions, branch names, idsNamed, sorting and comparison (numeric). An existing file keeps its name and its heading as written, and its number is shown as written in the heading, so an existing loop reads and prints exactly as before. Numbers of 100 and more are the same written padded or not; only 1 to 99 differ, so a loop of 100 issues or more never meets the difference. A loop whose first unpadded id of 1 to 99 is written is a loop an earlier reader would skip silently (it reads exactly three digits), so that first write raises the record format like the other silent-misread elements do. This work is coordinated with the Horde check of 326 before the Horde release, not before the Jarl release: Horde ticketFile matches /^\d{3,}-/, so a ticket filed with a plain number below 100 is one Horde cannot find until that check settles it.

## Why
Padding is a fixed width that the record outgrows (it already did at 1000), it makes numbers differ between 7 and 007 for no reader's benefit, and it forces every pattern in the code and every example in the skill to carry a width that means nothing.

## Acceptance
- A new issue in an empty loop is 1, 2, 3 and so on: file 1-<slug>.md, heading # 1 · <title>; the next free number is numeric over all files; no function pads, and the id grammar has one source
- 007 and 7 resolve to the same issue everywhere an id is read (lookup, After, ranges, comma lists, #7, log lines, review and ask lines, a-7 and a-007, branch names jarl/7- and jarl/007-, idsNamed) and compare and sort numerically; tested with a loop that holds both a padded file and an unpadded one
- An existing loop (001 to 999, padded files and headings) reads and prints identically to before and nothing is renamed; a new issue filed into it, from 100 up, looks the same as before
- The first write of an unpadded id of 1 to 99 raises the record format (the guard of the format marker); proved with the frozen earlier reader refusing the loop loudly
- The library callers of the record code see ids as strings that compare numerically and the record contract test still holds; Horde's own padded ids keep working
- SKILL.md, the help text, the MCP descriptions and the examples show plain numbers (no 001), in the present tense, without version words

## Changelog
- Changed: New issues and questions are numbered plainly: 7, not 007. Issues already in a loop keep their names and numbers, and 007 and 7 mean the same issue everywhere, so you can type either.

## Evidence

- **ran:** node --test tests/ids.test.mjs on the branch before the change · **saw:** 5 of 13 fail: no function pads an id, a new issue numbered 1, 007 and 7 are one issue, the branch jarl/7-slug, the first unpadded write raises the format
- **ran:** node --test tests/ids.test.mjs after the change · **saw:** 13 of 13 pass
- **ran:** status, resume, next --all, report, list --all, tips, queue, branches, show --full and check for every issue, on a copy of the 6.2.0 loop, with the release tip driver and with the changed driver · **saw:** all ten outputs byte-identical (337 issues); the same file names and the same text
- **ran:** npm test in skills/jarl/scripts with the changed id code, before the record-contract and expectation updates · **saw:** pass 313, fail 179, skipped 21; the release tip alone passes 488 of 488. 6 failures are in tests/record-contract.test.mjs, which asserts the library numbers a first issue 001; the rest assert 001 for new issues and a format-1 loop
- **ran:** npm test in skills/jarl/scripts at the commit for this issue · **saw:** tests 515, pass 494, fail 0, skipped 21
- **ran:** status, resume, next --all, report, list --all, tips, queue, branches, show --full and check for every issue on a copy of the 6.2.0 loop, release tip driver and the commit's driver · **saw:** all ten outputs byte-identical
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 43f7345 · **saw:** 515 tests, 494 pass, 0 fail, 21 skipped; model test: worker haiku-5.5 (one blocker found and reported honestly, one round, reviewer sonnet-5.5 approved with minors only)

