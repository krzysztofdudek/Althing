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
**Worker:** w-jarl-082-opus-takeover
**Worktree:** /home/me/Worktrees/JarlSkill/082-takeover-and-brief
**Since:** 2026-11-06 22:42

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
- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/brief.test.mjs (the round-2 tests, on copies of be25e1f and of b6f670c) · **saw:** be25e1f: tests 29, pass 23, fail 6: one reviewer's alike verdicts with the second entry lost gave the first verdict the log line and the kept entry listed apart, told apart by model, day or another reviewer's entry or not; nothing-tells-apart gave the kept entry to a verdict; a 6.2.0-written finding opening 'findings: model' was listed twice, and a driver-written one lost its 'findings: '. b6f670c: fail 12, among them the mirror case (first entry lost: the first verdict took the second's text) and the same two lead-in cases
- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/brief.test.mjs tests/docs-true.test.mjs tests/tense.test.mjs tests/vocabulary.test.mjs tests/words.test.mjs tests/skill-shape.test.mjs tests/help-workflow.test.mjs tests/modules.test.mjs tests/record-contract.test.mjs tests/models.test.mjs tests/batch-review.test.mjs tests/bot-reviews.test.mjs (commit 5cb2156) · **saw:** tests 193, pass 192, fail 0, skipped 1; brief.test.mjs alone: tests 29, pass 29
- **ran:** copy of releases/6.3.0/.jarl: for each of the 40 issues with a changes verdict, brief <id> --role reviewer, the Findings part, with b6f670c, be25e1f and 5cb2156, compared with cmp; and the notes about the Reviews section · **saw:** no issue differs between any two of the three, and no brief carries a Reviews-section note: this loop's verdicts are written by a writer that keeps no Reviews entry, so neither case occurs in it
- **ran:** cd skills/jarl/scripts && TMPDIR=<a mktemp -d folder> nice -n 15 timeout 1800 node tests/suite.mjs (branch tip 5cb2156) · **saw:** tests 1461, pass 1439, fail 0, skipped 22, cancelled 0

A correction of the wording of the round-2 red row: on be25e1f, with the second of two alike entries lost, the kept first entry went to the second verdict and the first verdict got the log line (the newest-first pairing), as the reviewer found; nothing was listed apart there. Pairing now takes an entry for a verdict only when every pairing with the most pairs, in the log's and the file's order and agreeing on reviewer, day, model, relay mark, batch and text, pairs the two; an entry nothing tells apart goes to no verdict, both verdicts give the log line, and the entry is listed after them, marked as the issue file's, with a note. A line with no paired entry gives its text as the log holds it, its findings: lead-in kept.
- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/brief.test.mjs (round 3 tests added, before the fix in findingsOf) · **saw:** tests 34, pass 30, fail 4: a model on one verdict only, either entry lost; models a, none, a with the middle or first entry lost; a batch verdict then a single one, either lost; a log-only verdict then the same finding with --model from this Jarl: each listed unpaired with a false note, or three times
- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/brief.test.mjs (at e020ad1, model and batch compared strictly in findingsOf) · **saw:** tests 34, pass 34, fail 0; the no-mark case (log-only verdict then this Jarl, same one-line finding) lists both log lines and the entry marked, with the note that nothing tells them apart
- **ran:** brief <id> --role reviewer on a copy of the loop for every issue with a changes verdict, Jarl at b6f670c versus e020ad1, Findings parts and note lines compared · **saw:** 40 issues with a changes verdict; Findings identical 40, different 0; notes different 0; failed 0
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at e020ad1) · **saw:** tests 1466, pass 1444, fail 0, cancelled 0, skipped 22, exit 0

