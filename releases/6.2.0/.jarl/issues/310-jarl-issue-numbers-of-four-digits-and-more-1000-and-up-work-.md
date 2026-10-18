# 310 · Jarl: issue numbers of four digits and more (1000 and up) work everywhere; below 1000 they stay padded to three, and existing loops change nothing

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** jarl, ids, field-report
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/jarl.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:547 and the other places listed in What, at 2c12aa3 (unchanged in these places at 67615e6)

## What
A coordinator of a loop in another project, which files several dozen issues a day and has 205, reached the limit of three digits in the plan: a loop of 1000 issues or more stops working. Verified in the source: the issue header is read with exactly three digits (jarl-lib.mjs:547), the file list with exactly three (:573), so jarl_new would write 1000-... and jarl_list would not see it; after, the id resolver, a range and a comma list pad to three (:564, :617, :1151, :1154, :995); the log reads a filed or review line with three digits (:1711, REVIEW_LINE :1750, movesInto :1754); idsNamed finds numbers of exactly three digits between boundaries (:1949); a branch name jarl/NNN- and [repo]/jarl/NNN- is matched with three (:2372); a question a-NNN and its issue NNN (ASK_RE :2731, :2748, :2761, :2788). Sorting is by string at :573, :1134 and :1549 (list, queue, next), so 1000 would come before 999. The next-number choice at :992 already reads three or more digits. In the same family, Althing's own loop rail already accepts three or more (rails/loop.mjs:8).

## Why
A permanent loop with a heavy filing rate reaches 999 within weeks; at that point filing, listing, showing, reviewing and asking all fail at once, and a loop cannot be repaired by renaming its files.

## Acceptance
- Numbers below 1000 are padded to three digits (007, 195); from 1000 a number has as many digits as it needs; file names, headings, after, #1000, ranges (998-1002), comma lists, branch names jarl/1000-..., questions a-1000 and issue 1000 in questions, and the log's filed and review lines work the same for both lengths
- Sorting and comparison of numbers are numeric everywhere, never by string (999 before 1000): the file list, list, queue, next, status, reports, and the choice of the next free number
- idsNamed recognises numbers of three or more digits and still does not catch a piece of a longer number, a year, a hash or a version; tested on a text with dates and hashes
- Existing loops are unchanged: files 001-999 and their references keep their names, and old jarl/NNN- branches are still recognised
- Test on a loop with 998, 999, 1000 and 1001: new, list, show, set, after, ranges, review, the log and a question a-1000, each by CLI and by the MCP tool
- SKILL.md and help say a number has at least three digits

## Evidence

