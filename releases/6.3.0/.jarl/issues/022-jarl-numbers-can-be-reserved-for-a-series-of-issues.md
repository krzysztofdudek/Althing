# 022 · Jarl: numbers can be reserved for a series of issues

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**After:** 035
**Branch:** jarl/043-profile-and-numbers
**Merged:** 8693a5685259c315cea8215f93e5096da1e57d10 in ../../../JarlSkill
**CI:** none

## What
An owner wanted series kept apart by number (a film from 1000, merged upstream changes from 2000). new always takes the next free number, and a hand-made file with a high number would move the counter for every later issue.

## Why
Series kept apart by number are easy to read and to talk about; tags alone were a workaround.

## Acceptance
- new can take a number from a named range the loop declares, and the next free number elsewhere is unaffected
- Tests

## Changelog
- Added: A loop can keep a series of tasks apart by number, such as films from 1000, with a line Range (film): 1000-1999 in its goal, and file a task in it with new --range film. Other tasks keep counting on their own, and a file numbered by hand moves no other series. The first task filed in a range moves the loop to format 3.

## Evidence

Kept by the model as the owner's series feature, not the id mechanism (report section 8; ids are made safe by 084).
- **ran:** cd skills/jarl/scripts && node --test tests/number-ranges.test.mjs, on the release branch at 0e17fb9 · **saw:** red: 6 tests, pass 0, fail 6 — goal --set refuses a Range line and new has no --range
- **ran:** cd skills/jarl/scripts && node --test tests/number-ranges.test.mjs, at 500ae62 · **saw:** green: 6 tests, pass 6, fail 0 — new --range film files 1000, 1001, 1002 while plain filings take 1, 2 and step past a range; a hand-made 5000 moves only the plain count; undeclared, full and moving ranges refused with a form, nothing written; a composer's loop refuses a range number unraised; both frozen readers read a declared range and refuse the loop once a range number is filed (format 3)
- **ran:** jarl.mjs goal --set 'Range (film): 1000-1999', then new, new --range film, new, on a copy of the 6.3.0 loop at tip · **saw:** filed 200, then 1000, then 201: the next free number outside the range is unaffected by the series
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at f7c8408 · **saw:** tests 1600, pass 1578, fail 0, skipped 22 (the record contract test included)
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at 098248f (release branch 1e6d579 merged) · **saw:** tests 1630, pass 1608, fail 0, skipped 22; the merge c75b674 alone: tests 1623, pass 1601, fail 0, skipped 22
- **ran:** cd skills/jarl/scripts && node --test over every test file except tests/retract.test.mjs on the merged tip of the release branch, TMPDIR from mktemp -d (that file peaks at about 960000 inodes and is reported by issue 202; it passes alone on the branch tip, 22 of 22) · **saw:** tests 1608, pass 1586, fail 0, skipped 22, merge 8693a56

