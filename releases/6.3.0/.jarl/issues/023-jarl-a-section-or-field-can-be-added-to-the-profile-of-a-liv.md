# 023 · Jarl: a section or field can be added to the profile of a live loop

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Key:** 20261028T0924-spaj
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/043-profile-and-numbers
**Merged:** 8693a5685259c315cea8215f93e5096da1e57d10 in ../../../JarlSkill
**CI:** none

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

- **ran (history):** cd skills/jarl/scripts && node --test tests/profile-extend.test.mjs, on the release branch at 0e17fb9 · **saw:** red: 5 tests, pass 0, fail 5 — extend is not a command
- **ran (history):** cd skills/jarl/scripts && node --test tests/profile-extend.test.mjs, at 3113280 · **saw:** green: 5 tests, pass 5, fail 0 — extend section and extend field write the profile (built-in statuses for a loop with none, its format kept), a log line, verify clean; filed issues not rewritten, new issues take the default; reserved, held, Kind and bad values refused with a form and nothing written; a composer's loop refused with its command; both frozen readers read the extended profile, no format raised
- **ran (history):** jarl.mjs extend section Risks and extend field Area --values ui,api --default ui on a copy of the 6.3.0 loop, then status and profile with the pinned driver and the installed 6.2.0 · **saw:** profile.json written with the built-in statuses, Risks and Area, no format key; two log lines; verify findings unchanged; the driver and 6.2.0 both read the loop and show Area and Risks in their profile view
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at f7c8408 · **saw:** tests 1600, pass 1578, fail 0, skipped 22 (the record contract test included)
- **ran (history):** cd skills/jarl/scripts && node --test tests/profile-extend.test.mjs, at c75b674 (the merge of the release branch, before the fix) · **saw:** red: 10 tests, pass 6, fail 4 — extend --by on a format-1 loop with no profile, a format-2 loop and a format-1 loop with its own profile left no format in profile.json, and a profile write that fails still logged its line
- **ran (history):** cd skills/jarl/scripts && node --test tests/profile-extend.test.mjs, at 9eaf809 · **saw:** green: 10 tests, pass 10, fail 0 — on format 1 (with and without a profile), 2 and 3: extend without --by keeps the format, with --by the profile holds format 3 and both parts, verify clean after each; the frozen readers read the unraised loops; a failed profile write logs nothing, with --by and without
- **ran (history):** jarl.mjs extend section Risks --by jarl on a copy of the 6.3.0 loop, at 9eaf809 · **saw:** verify 6 findings before and 6 after; profile.json holds format 3
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at 098248f (release branch 1e6d579 merged) · **saw:** tests 1630, pass 1608, fail 0, skipped 22; the merge c75b674 alone: tests 1623, pass 1601, fail 0, skipped 22
- **ran (history):** cd skills/jarl/scripts && node --test over every test file except tests/retract.test.mjs on the merged tip of the release branch, TMPDIR from mktemp -d (that file peaks at about 960000 inodes and is reported by issue 202; it passes alone on the branch tip, 22 of 22) · **saw:** tests 1608, pass 1586, fail 0, skipped 22, merge 8693a56

