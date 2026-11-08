# 183 · Jarl: the log tail of resume still shows the first line of a retracted note that starts with a list bullet, is escaped when written, or ends with the long-note wording

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-104-opus-e2
**Where:** skills/jarl/scripts/lib/resume.mjs retractedNoteEvents: the key of the note is built by stripping a leading bullet and the strike marks, but the log keeps them
**Branch:** jarl/182-resume-and-brief
**Worker:** w-jarl-182-opus
**Worktree:** /home/me/Worktrees/JarlSkill/182-resume-and-brief
**Since:** 2026-11-08 10:43

## What
A retracted note whose text starts with a list bullet, whose first line is escaped when written (a leading heading mark or a conflict marker), or whose own text ends with the wording of the long-note suffix keeps its first line in resume's log tail. The count is right.

## Why
A retracted note and its reason should be out of what a worker reads in every case.

## Acceptance
The key of a note is built the way the log writes it, and a test holds the bullet, the escaped and the suffix-wording cases

## Evidence

- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='list bullet|every sequence of notes' tests/retract.test.mjs (tests first, the matcher of resume as on af51383) · **saw:** 2 tests, 0 pass, 2 fail: the tail kept '001 evidence · - a list item' of the retracted note, and the sequence check kept '001 evidence · - same'
- **ran:** cd skills/jarl/scripts && node --test tests/retract.test.mjs tests/resume.test.mjs tests/log-reader.test.mjs tests/record-contract.test.mjs tests/library-parity.test.mjs tests/modules.test.mjs (on bbec024) · **saw:** 60 tests, 59 pass, 0 fail, 1 skipped; the bullet, escaped heading and conflict marker, struck-looking and pointer-wording cases hide their own line in both orders, and 778 note histories (parts and no parts, every set retracted) leave out exactly the retracted notes' lines with the right count
- **ran:** resume --log 200 on a copy of this loop, release/6.2.1 against 1cc26b6 · **saw:** identical output
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs (on 1cc26b6) · **saw:** 1576 tests, 1554 pass, 0 fail, 22 skipped
- **ran:** driver init, new, evidence 001 with a two-line note; retract 001 note-1 --by jarl, then resume, with the tip of round 1 (1cc26b6), with release/6.2.1 at 835fcd0 and with 87d19ea · **saw:** 1cc26b6 shows '001 evidence · checked on two platforms' in the tail; 835fcd0 and 87d19ea hide it; all three say 1 note retracted
- **ran:** the histories of tests/note-writers.mjs (notes written by this Jarl, the pinned writer of formats 1 and 2 and the pinned first writer, every order, every set retracted by the tip) over the record library of 835fcd0, of 1cc26b6 and of 87d19ea, compared by hand · **saw:** 4242 histories, none refused by a writer; 835fcd0 right in 2502 (a live note's line hidden in 99), 1cc26b6 right in 2743 (live hidden in 35), 87d19ea right in 4242; 87d19ea wrong where 835fcd0 is right: 0; right where 835fcd0 is wrong: 1740; wrong on both: 0
- **ran:** cd skills/jarl/scripts && node --test tests/retract.test.mjs (on 87d19ea) · **saw:** 22 tests, 22 pass; the three-writer test asserts all 4242 histories right, no writer refusing
- **ran:** brief <id> --role reviewer, text and --json, for the 46 issues of a copy of this loop with a changes verdict, and resume --log 200, 835fcd0 against 87d19ea · **saw:** 46 of 46 identical in the Findings part and the notes; resume identical
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs (on 87d19ea) · **saw:** 1577 tests, 1555 pass, 0 fail, 22 skipped

