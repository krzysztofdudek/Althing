# 083 · Jarl: one record format raise to 3 in 6.3.0, with the jarl-record/2 contract, never applied to a loop under a composer's profile

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** design, format
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#model-format-raise
**Where:**
**After:** 035
**Branch:** jarl/083-format-raise-3
**Worker:** w-jarl-083-opus
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-083
**Since:** 2026-11-03 12:44

## What
Ruling one-format-raise-horde-later: every change of the model that an older reader would misread rides one raise to format 3 (report section 9 lists them: the issue key, the writer, the owner-only mark, the parent of a sub-issue, the batch id, the kinds promise and wait, the escalation ask kind, and the retraction of a note, 019, which reuses the shape of a row's retraction). Horde re-vendors later, so a composer's loop is never raised.

## Why
Several raises across a release, or a raise that reaches a Horde mission, would make readers refuse loops they read today.

## Acceptance
- The raise to format 3 happens at the first write that needs it, under the lock, as the raise to format 2 does today; a reader that knows format 2 only refuses a format 3 loop with a message naming the version that reads it
- A loop whose profile names a composer (an external scheduler) is never raised; a write that would need format 3 there is refused with the reason, and the feature says it is off in that loop
- record.mjs exports the jarl-record/2 contract with the new lines; references/record.md and composers.md describe them
- Tests: the raise on the first write that needs it, the refusal by a format-2 reader, and a composer-profiled loop never raised

## Changelog
- Changed: A loop is marked with format 3, the format of Jarl 6.3.0, the first time Jarl writes into it one of the new kinds of entries this release adds; an earlier Jarl then refuses it with a clear message instead of misreading it. Jarl no longer changes the format of a loop that another tool runs, such as a Horde mission: new issues there get three-digit numbers, and anything that would need a newer format is refused with a message that says why. Tools that build on Jarl's record library get a new version of its contract, which keeps everything the previous version offered.

## Evidence

- **ran:** node --test tests/format-marker.test.mjs tests/record-contract.test.mjs tests/profile-keys.test.mjs, the new tests on release/6.2.1 at 2236405 before the change (TMPDIR under ~/Temp/tmp) · **saw:** 33 tests, 22 pass, 11 fail: raise to 3 from format 1 and from 2, refusal by the frozen readers of format 1 and of formats 1 and 2, composer loop refused and never raised, status/verify/profile naming the format, jarl-record/2 and recordFormat; the read-only guard passes before and after
- **ran:** the same three files on jarl/083-format-raise-3 at 9762f81, then nice -n 15 timeout 1800 npm test in skills/jarl/scripts (TMPDIR under ~/Temp/tmp) · **saw:** 33 pass 0 fail; full suite 923 tests, 900 pass, 0 fail, 23 skipped
- **ran:** on a copy of releases/6.3.0/.jarl: this branch's jarl status, resume, list, next, verify, profile, show 083, queue, report, then evidence 083 (a note); then the pinned driver's status, list and show 083 on the same copy; on a second copy a raise to 3 by the branch library, then the driver's status · **saw:** no profile.json is written, status says record format 1, verify 'record format 1: clean'; the driver reads the copy as before (status, list, show print, the note shows); on the raised copy the driver refuses: 'is written for record format 3, and this Jarl reads format 1 - use the Jarl the loop was opened with ..., or upgrade this one'

Correction to the first red row: the reviewer counted 34 tests with 12 failing on 2236405 and 34 passing at 9762f81, the record-md table test included; the row's 33 and 11 were counted before that test was added.
- **ran:** node --test tests/profile-keys.test.mjs tests/format-marker.test.mjs from b8d974c, run on 9762f81 in a scratch worktree (TMPDIR under ~/Temp/tmp) · **saw:** 26 tests, 3 fail: on a Horde-profiled mission new filed 1 and raised to 2, a row retraction raised it, the mission views listed plain ids; the composer test's raise to 2 was not refused
- **ran:** the same files at b8d974c, with one-store and repositories; then nice -n 15 timeout 1800 npm test (TMPDIR under ~/Temp/tmp) · **saw:** 26 of 26, then 105 tests 102 pass 0 fail 3 skipped; full suite 925 tests, 902 pass, 0 fail, 23 skipped: on the mission new files 001 and a-001, the frozen 6.1.0 reader reads it, retract, a repository by name alone and a plain number are refused with nothing written, a repository by path keeps its path; an ordinary loop still raises to 2

