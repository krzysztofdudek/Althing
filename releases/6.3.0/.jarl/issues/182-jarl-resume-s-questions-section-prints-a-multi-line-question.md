# 182 · Jarl: resume's questions section prints a multi-line question on several lines, and three refusals print field commands with a filled id

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-099-opus-e
**Where:** lib/resume.mjs the questions section; lib/commands.mjs around lines 1248 and 1264; lib/repositories.mjs line 504
**Branch:** jarl/182-resume-and-brief
**Merged:** 1e6d5795ac284f48c51c05640b11b9e397fcf9b5 in ../../../JarlSkill
**CI:** none

## What
The questions section of resume still prints a question of several lines on several lines, where next --as now prints one row. Three refusals print a field command with a filled issue id instead of a form with a placeholder.

## Why
One row per question keeps the list scannable, and a filled command in a refusal can be pasted as printed.

## Acceptance
The questions section prints one row per question, the three refusals end with forms that carry a placeholder, and a test holds each

## Changelog
- Fixed: the resume now shows each open question to the owner on one line, even one written over several lines. The question itself is kept as it was asked.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='one row of resume|names the issue in its reason|a wait names its person' tests/next-as.test.mjs (on 835fcd0, tests first) · **saw:** 3 tests, 0 pass, 3 fail: resume printed the question of a-1 on three lines; field 1 Kind wait ended with field 1 Person and field 1 'Check when'; field 1,2 'Check when' --clear named field 2 in its reason and field 1 in its form
- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='one row of resume|names the issue in its reason|a wait names its person' tests/next-as.test.mjs (on af51383) · **saw:** 3 tests, 3 pass: one row per question in resume, the whole question in --json; both refusals end with field "<ids>" ... forms, the reason naming the issue that is a wait
- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='base is the command' tests/surface.test.mjs (on 835fcd0, the base refusal pinned whole) · **saw:** 1 pass: the refusal of base for an undeclared repository already ends with field "<id>" Repo "<name-or-path>" and base "<name>" "<branch>"; that third refusal does not reproduce, the test now holds it
- **ran:** cd skills/jarl/scripts && node --test tests/refusals.test.mjs (on af51383) · **saw:** 28 tests, 27 pass, 0 fail, 1 skipped; its pin of the filled ids of the wait refusal was changed to the forms
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs (on 1cc26b6) · **saw:** 1576 tests, 1554 pass, 0 fail, 22 skipped
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on imports of brief, issues and evidence and on the evidence log write (K1 added the line marks, this group the note log text), resolved by keeping both; the walk test files and retract.test.mjs then rerun alone · **saw:** tests 1606, pass 1578, fail 6, all six ENOSPC: the new note-writers test of 183 peaks at about 963000 of the 1048576 inodes of the shared temporary filesystem while another suite runs; rerun alone: refusals-walk and refusals-walk-reviewers-b 2 of 2 pass, retract.test.mjs 22 of 22 pass; merge 1e6d579

