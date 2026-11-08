# 190 · Jarl: the brief lists a finding three times when 6.1.0 wrote its log line without a lead-in and a later Jarl wrote the same finding, and the any-order pairing grows with the cube of the review lines

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-157-opus-f4
**Where:** skills/jarl/scripts/lib/brief.mjs findingsOf
**Branch:** jarl/182-resume-and-brief
**Merged:** 1e6d5795ac284f48c51c05640b11b9e397fcf9b5 in ../../../JarlSkill
**CI:** none

## What
(1) The same finding opening with model from one reviewer on one day, given once by the 6.1.0 driver (no lead-in, no Reviews entry) and once by 6.2.0 or the current Jarl, is listed three times and the note says nothing tells the two apart, though the missing lead-in does (20 of 2699 mixed-writer variants). (2) Pairing in any order, which runs only for an out-of-order file, grows with about the cube of the review lines: 17 ms at 62 lines, 1.2 s at 252.

## Why
A brief should list a finding once, and a pairing should stay cheap.

## Acceptance
The pairing uses the missing lead-in as a difference between a 6.1.0 line and a later one, and the any-order pairing is quadratic or capped with a note; a test holds each

## Evidence

- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='opening like a model mark' tests/brief.test.mjs (tests first, on 7a870b7) · **saw:** 1 fail: the finding of the writer that keeps only the log and of this Jarl was listed three times, the second as 'findings: model big-model was asked. Important: the count is off.' and the entry after them marked in the issue file only
- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='writer that keeps only the log and sets no lead-in' tests/brief.test.mjs (lib/brief.mjs as on 7a870b7) · **saw:** 2 tests, 0 pass, 2 fail; the oracle of both writers first fails at 'opens logOnlyOpens; kept 01'
- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern='pairing in any order|250 review lines' tests/brief.test.mjs (the pairing in any order as on 7a870b7) · **saw:** 1 fail: on 250 lines and 200 entries the pairing asked 69791671 times whether a line and an entry fit, expected 50000; the 250-line brief test took 790 ms
- **ran:** cd skills/jarl/scripts && node --test tests/brief.test.mjs (on 1cc26b6) · **saw:** 46 tests, 46 pass; oracle 34897 histories and 1943 histories of both writers agree; 4000 graphs agree with the pairing's definition; 50000 asks on 250 lines; the 250-line brief test 102 ms
- **ran:** brief <id> --role reviewer, text and --json, for the 45 issues of a copy of this loop with a changes verdict, release/6.2.1 against 1cc26b6 · **saw:** 45 of 45 identical in the Findings part and the notes
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs (on 1cc26b6) · **saw:** 1576 tests, 1554 pass, 0 fail, 22 skipped
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on imports of brief, issues and evidence and on the evidence log write (K1 added the line marks, this group the note log text), resolved by keeping both; the walk test files and retract.test.mjs then rerun alone · **saw:** tests 1606, pass 1578, fail 6, all six ENOSPC: the new note-writers test of 183 peaks at about 963000 of the 1048576 inodes of the shared temporary filesystem while another suite runs; rerun alone: refusals-walk and refusals-walk-reviewers-b 2 of 2 pass, retract.test.mjs 22 of 22 pass; merge 1e6d579

