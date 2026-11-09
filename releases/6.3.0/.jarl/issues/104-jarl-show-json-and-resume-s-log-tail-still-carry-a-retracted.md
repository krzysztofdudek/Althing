# 104 · Jarl: show --json and resume's log tail still carry a retracted note and its reason that a worker's view hides

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T1553-ijgo
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 019
**Found by:** rev-jarl-019-opus
**Where:** Review of 019 (2026-11-03): show --json raw evidence text; resume's log tail
**Branch:** jarl/099-views-and-printed-commands
**Merged:** f1c6df3894bc06fedec9a5ce9a8eb6b277f69d7c in ../../../JarlSkill
**CI:** none

## What
After 019 the worker view of show hides a retracted note and its reason, but show --json still carries them, and resume's log tail prints a note's retraction reason, and workers run resume after a compaction.

## Why
Ruling retracted-note-reason-hidden-from-workers says what a worker reads hides both; two views still show them.

## Acceptance
show --json and resume leave a retracted note and its reason out of what a worker reads, and say how many were retracted, with tests

## Evidence

- **ran (history):** node --test --test-name-pattern='show --json and resume leave' tests/retract.test.mjs in a copy of the release branch before the change (new test), and node jarl.mjs show 1 --json and resume on a scratch loop with a retracted note · **saw:** before: fail, show --json carried the struck-through note and the line '- **retracted:** note 1 ... wrong note: it restates the secret subject', and the resume log tail printed both the note's line and the retract line with its reason
- **ran (history):** the same test and the same two commands on the branch tip · **saw:** pass 1; show --json has no note and no reason and carries retractedNotes: 1; show --full --json keeps both; resume leaves out the two log lines and prints '(1 note retracted, not shown; the reasons are in the log and in show --full)', its --json carries logRetractedNotes: 1
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (full suite, branch tip 8aa658d, TMPDIR in one mktemp folder) · **saw:** tests 1420, pass 1398, fail 0, skipped 22, exit 0; record-contract and library-parity pass
- **ran (history):** node --test tests/retract.test.mjs on the tip before the fix, with the new tests (lib/resume.mjs at the previous commit) · **saw:** 3 of the new tests fail: a live note that starts with the retracted note's words loses its line in the resume tail (actual tail empty, expected the longer note's line), also for the same-words pair and the multi-line note
- **ran (history):** node --test tests/retract.test.mjs on the fixed tip · **saw:** tests 18, pass 18, fail 0; resume text, resume --json and show --json all say 1 note retracted in every new case (prefix-alike notes both ways, same-words pair with either note retracted, identical text, a retracted note of several lines, notes of a second issue untouched)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs on the fixed tip · **saw:** tests 1424, pass 1402, fail 0, skipped 22; the inode use of the temporary filesystem showed 1% used
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1463, pass 1441, fail 0, skipped 22, merge f1c6df3

