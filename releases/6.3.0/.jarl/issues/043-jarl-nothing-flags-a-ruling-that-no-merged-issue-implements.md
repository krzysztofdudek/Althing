# 043 · Jarl: nothing flags a ruling that no merged issue implements

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261103T0838-opfo
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-0a2a9cba
**Where:** JarlSkill/skills/jarl/scripts/lib/questions.mjs (cmdDecide), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5763 at a1132a8
**Branch:** jarl/043-profile-and-numbers
**Merged:** 8693a5685259c315cea8215f93e5096da1e57d10 in ../../../JarlSkill
**CI:** none

## What
Claim: Two rulings were never implemented and nobody noticed until an audit. Corrected by the sceptic: Correct where to jarl-lib.mjs:1193 and 6360; the proposal narrows to verify (and resume) listing rulings whose Settles issues are not all done.

decide --settles writes a ruling into issues' evidence; verify lists only open issues that cite a superseded ruling. Map row fr-08.

## Why


## Acceptance
- verify lists each ruling in force whose Settles names an issue that is neither done nor dropped, with the ruling's slug and those ids
- A test with one such ruling and one fully settled ruling; red on 71ebc5b

## Changelog
- Added: The record check and the resume now list each ruling in force that names tasks it settles which are not yet done or dropped, so a ruling nobody carried out no longer goes unnoticed. It is only a note and never makes the check fail.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/unsettled-rulings.test.mjs, on the release branch at 0e17fb9 · **saw:** red: 2 tests, pass 0, fail 2 — verify printed no note for the ruling waits-on-work, and resume had no heading for it
- **ran (history):** cd skills/jarl/scripts && node --test tests/unsettled-rulings.test.mjs, at 50f4eb9 · **saw:** green: 2 tests, pass 2, fail 0 — verify lists ruling waits-on-work with issue 1 (open) and stays clean; all-settled and the superseded ruling are not listed; resume lists the same under its own heading
- **ran (history):** jarl.mjs verify and resume on a copy of the 6.3.0 loop, base 0e17fb9 against tip f7c8408 · **saw:** 2 rulings listed, no flood: everything-from-the-field-report-into-6-2-1 settles 006 (in-progress), sixth-scenario-one-agent-alone settles 076 (open); verify findings unchanged (the same 6 log findings before and after)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at f7c8408 · **saw:** tests 1600, pass 1578, fail 0, skipped 22 (the record contract test included)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at 098248f (release branch 1e6d579 merged) · **saw:** tests 1630, pass 1608, fail 0, skipped 22; the merge c75b674 alone: tests 1623, pass 1601, fail 0, skipped 22
- **ran (history):** cd skills/jarl/scripts && node --test over every test file except tests/retract.test.mjs on the merged tip of the release branch, TMPDIR from mktemp -d (that file peaks at about 960000 inodes and is reported by issue 202; it passes alone on the branch tip, 22 of 22) · **saw:** tests 1608, pass 1586, fail 0, skipped 22, merge 8693a56

