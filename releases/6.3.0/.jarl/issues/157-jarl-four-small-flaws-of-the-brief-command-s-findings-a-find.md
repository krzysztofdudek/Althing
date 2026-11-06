# 157 · Jarl: four small flaws of the brief command's findings: a finding that begins with 'findings: model' is listed twice, a newer entry can stand in for an older one, matched findings keep the file's escapes, and commands.md says every finding is whole

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-058c-opus
**Where:** Review of 058 (rev-jarl-058c-opus), Minor findings
**Branch:** jarl/082-takeover-and-brief
**Worker:** w-jarl-082-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/082-takeover-and-brief
**Since:** 2026-11-06 21:07

## What
(1) A finding whose own text begins with 'findings: model' or 'findings: relayed' does not match its log line (lib/brief.mjs:52-55) and is listed twice, the second time with a note that wrongly says it matches no log line. (2) With the same reviewer, first line and line count where the file keeps only the newer entry, the newer text stands in the older verdict's place (brief.mjs:56). (3) A matched finding is shown with the file's escapes (backslash before a marker or hash) because fromFile does not unescape (brief.mjs:46). (4) The brief row of references/commands.md says every finding is given whole, but where the file entry is gone only the log's first line can be shown and its pointer names a Reviews section that does not hold the rest, with no note.

## Why
A brief is read by an agent that trusts it; a doubled finding or an escaped one costs it time, and a sentence that promises more than the output gives is false.

## Acceptance
Each of the four is corrected or said honestly in the docs, with a test where the code changes

## Evidence

- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/brief.test.mjs (the new and tightened findings tests, on the code of 069569e) · **saw:** tests 22, pass 19, fail 3: findings opening 'findings: model' and 'findings: relayed ·' came out as 'model …' and 'relayed …' and were listed a second time as in the issue file only; with the file keeping only rev1's newer entry, the older verdict took the newer text and the newer one got the log line; a matched finding kept the file's backslashes before <<<<<<< and #
- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/brief.test.mjs tests/docs-true.test.mjs tests/tense.test.mjs tests/vocabulary.test.mjs tests/words.test.mjs tests/skill-shape.test.mjs tests/help-workflow.test.mjs tests/modules.test.mjs tests/record-contract.test.mjs (commit 33313a1), then tests/models.test.mjs tests/batch-review.test.mjs tests/bot-reviews.test.mjs · **saw:** tests 105, pass 105, fail 0; then tests 103, pass 102, fail 0, skipped 1
- **ran:** copy of releases/6.3.0/.jarl: for each of the 39 issues with a changes verdict, brief <id> --role reviewer, the Findings part, with the code of b6f670c and with 33313a1, compared with cmp · **saw:** no issue differs: none of the four flaws occurs in this loop's record

Point 4 is corrected in the docs only: the brief row of references/commands.md now says a finding is whole where the Reviews section holds its entry, else as the log's line holds it (its first line and a count of the lines left out). The writer's lead-in for a finding that opens like a mark is now reversible: a text that already opens with the lead-in before such a word gets one more, and the brief takes off exactly one.
- **ran:** cd skills/jarl/scripts && TMPDIR=<a mktemp -d folder> nice -n 15 timeout 1800 node tests/suite.mjs (branch tip be25e1f) · **saw:** tests 1454, pass 1432, fail 0, skipped 22 (the run before be25e1f failed only the writer test, whose round line still had the shape before 3269ebd; be25e1f updates it)

