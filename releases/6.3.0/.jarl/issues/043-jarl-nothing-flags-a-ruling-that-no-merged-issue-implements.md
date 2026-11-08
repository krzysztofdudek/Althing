# 043 · Jarl: nothing flags a ruling that no merged issue implements

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-0a2a9cba
**Where:** JarlSkill/skills/jarl/scripts/lib/questions.mjs (cmdDecide), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5763 at a1132a8
**Branch:** jarl/043-profile-and-numbers
**Worker:** w-jarl-043-opus
**Worktree:** /home/me/Worktrees/JarlSkill/043-profile-and-numbers
**Since:** 2026-11-08 11:18

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

- **ran:** cd skills/jarl/scripts && node --test tests/unsettled-rulings.test.mjs, on the release branch at 0e17fb9 · **saw:** red: 2 tests, pass 0, fail 2 — verify printed no note for the ruling waits-on-work, and resume had no heading for it
- **ran:** cd skills/jarl/scripts && node --test tests/unsettled-rulings.test.mjs, at 50f4eb9 · **saw:** green: 2 tests, pass 2, fail 0 — verify lists ruling waits-on-work with issue 1 (open) and stays clean; all-settled and the superseded ruling are not listed; resume lists the same under its own heading
- **ran:** jarl.mjs verify and resume on a copy of the 6.3.0 loop, base 0e17fb9 against tip f7c8408 · **saw:** 2 rulings listed, no flood: everything-from-the-field-report-into-6-2-1 settles 006 (in-progress), sixth-scenario-one-agent-alone settles 076 (open); verify findings unchanged (the same 6 log findings before and after)
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at f7c8408 · **saw:** tests 1600, pass 1578, fail 0, skipped 22 (the record contract test included)

