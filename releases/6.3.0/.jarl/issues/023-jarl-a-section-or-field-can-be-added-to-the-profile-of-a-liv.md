# 023 · Jarl: a section or field can be added to the profile of a live loop

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/043-profile-and-numbers
**Worker:** w-jarl-043-opus
**Worktree:** /home/me/Worktrees/JarlSkill/043-profile-and-numbers
**Since:** 2026-11-08 11:18

## What
The owner asked for a new section on every issue of a loop that already held 256 issues. Sections come only from a profile, and a profile only from init --profile, so the profile was written into the loop by hand and checked with profile and verify.

## Why
Loops grow; a change of their shape should be a command with a log line, not a hand edit of the profile file.

## Acceptance
- A command extends the profile of a live loop with a section or field, checks it as profile <file> does, and writes a log line
- verify is clean after it; a test

## Changelog
- Added: A loop that is already running can get a new section or a new field on its tasks with extend section or extend field, checked by the same rules as a new loop's profile and noted in the log, instead of editing the profile file by hand. Tasks already filed stay as they are until you fill the new part in.

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/profile-extend.test.mjs, on the release branch at 0e17fb9 · **saw:** red: 5 tests, pass 0, fail 5 — extend is not a command
- **ran:** cd skills/jarl/scripts && node --test tests/profile-extend.test.mjs, at 3113280 · **saw:** green: 5 tests, pass 5, fail 0 — extend section and extend field write the profile (built-in statuses for a loop with none, its format kept), a log line, verify clean; filed issues not rewritten, new issues take the default; reserved, held, Kind and bad values refused with a form and nothing written; a composer's loop refused with its command; both frozen readers read the extended profile, no format raised
- **ran:** jarl.mjs extend section Risks and extend field Area --values ui,api --default ui on a copy of the 6.3.0 loop, then status and profile with the pinned driver and the installed 6.2.0 · **saw:** profile.json written with the built-in statuses, Risks and Area, no format key; two log lines; verify findings unchanged; the driver and 6.2.0 both read the loop and show Area and Risks in their profile view
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at f7c8408 · **saw:** tests 1600, pass 1578, fail 0, skipped 22 (the record contract test included)

