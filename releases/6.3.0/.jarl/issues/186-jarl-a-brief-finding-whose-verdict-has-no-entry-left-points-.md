# 186 · Jarl: a brief finding whose verdict has no entry left points to a Reviews section that does not hold its text, with no note saying so

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261106T2228-uuss
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-082-opus-r3
**Where:** skills/jarl/scripts/lib/brief.mjs the pointer of a finding; tests/brief.test.mjs the POINTER tests
**Branch:** jarl/182-resume-and-brief
**Merged:** 1e6d5795ac284f48c51c05640b11b9e397fcf9b5 in ../../../JarlSkill
**CI:** none

## What
Where one verdict's entry in the Reviews section is lost and the other is told apart, the log line's pointer names a Reviews section that does not hold the text, and no note says so. A one-line note is only true when no entry is left over.

## Why
A pointer that promises more than the output gives is false.

## Acceptance
The brief says in one line when the pointer leads to text the section no longer holds, the four POINTER tests are updated for it, and a test holds the case

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/brief.test.mjs (tests first, lib/brief.mjs as on bbec024) · **saw:** 41 tests, 29 pass, 12 fail: the new pointer test, the POINTER tests that now expect the note, and the oracle of every pairing
- **ran (history):** cd skills/jarl/scripts && node --test tests/brief.test.mjs (on 7a870b7) · **saw:** 41 tests, 41 pass; the oracle checked 34897 histories and agrees on findings and notes in each, 22243 of them with the note, and in every history the writers wrote a finding the note counts has lost its entry
- **ran (history):** brief <id> --role reviewer, text and --json, for the 45 issues of a copy of this loop with a changes verdict, release/6.2.1 against 1cc26b6 · **saw:** 45 of 45 identical in the Findings part and the notes; no note about the Reviews section appears
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs (on 1cc26b6) · **saw:** 1576 tests, 1554 pass, 0 fail, 22 skipped
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on imports of brief, issues and evidence and on the evidence log write (K1 added the line marks, this group the note log text), resolved by keeping both; the walk test files and retract.test.mjs then rerun alone · **saw:** tests 1606, pass 1578, fail 6, all six ENOSPC: the new note-writers test of 183 peaks at about 963000 of the 1048576 inodes of the shared temporary filesystem while another suite runs; rerun alone: refusals-walk and refusals-walk-reviewers-b 2 of 2 pass, retract.test.mjs 22 of 22 pass; merge 1e6d579

