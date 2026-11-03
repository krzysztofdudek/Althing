# 019 · Jarl: a note can be retracted like a row, and a retracted note is hidden from what a worker reads

**Status:** in-progress
**Kind:** gap
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/019-retract-a-note
**Worker:** w-jarl-019-sonnet
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-019
**Since:** 2026-11-03 10:17
**After:** 083

## What
Two notes on an unstarted issue had to be withdrawn when the owner decided its future worker must not see their subject. retract <id> <n> refuses because only ran/saw rows are numbered, although the evidence tool's own retract field suggests otherwise. The only way out was to file the issue again and drop the old one.

## Why
What a worker is told must be correctable without renumbering the work around it.

## Acceptance
- Notes are numbered for retraction as rows are; retract takes a note back with who and why
- show keeps the retracted note struck through, and the view a worker reads leaves it out
- Tests for both

## Changelog
- Added: A note written on a task can be taken back, as an evidence row can, with who took it back and why. The issue view that a worker reads leaves a retracted note out, and the full view shows it struck through.

## Evidence

- **ran:** jarl retract 026 note-1 on a copy of the loop, release branch Jarl (before) · **saw:** retract takes review (the newest approve) or the number of an evidence row, got "note-1"
- **ran:** jarl retract 026 note-1 --by jarl on the same copy, this branch; then show 026 and show 026 --full; the pinned driver's list on the copy · **saw:** 026 evidence note 1 retracted by jarl; show leaves the note out, --full prints [note-1] struck through with ~~; the driver refuses the copy: written for record format 2 (the format raise, as a row retraction does), never misreads it
- **ran:** node --test tests/retract.test.mjs (3 new note tests); full npm test in skills/jarl/scripts, TMPDIR under ~/Temp/tmp · **saw:** retract tests 12 pass 0 fail; full suite 843 tests, 819 pass, 1 fail (a view expectation now numbered, fixed and rerun green); an earlier full run's resume timing failure passes alone

Held by the jarl (2026-11-03, ruling one-format-raise-horde-later): the worker's commit 96ab6d1 retracts a note with the row-retraction shape, which raises the record format on the first retraction, so the pinned driver (6.1.0) then refuses the loop. 6.3.0 raises the format once, through 083, never on a composer's loop; this issue does not merge before 083 and its retraction shape rides that raise. The branch jarl/019-retract-a-note stays as it is. Also open from the worker: the reason of a retraction stays visible to workers (hide it too?) and show --json carries retracted notes in its raw evidence text

