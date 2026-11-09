# 013 · Jarl: a merge recorded before its check finished shows as waiting for the check

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261022T0716-iobh
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/009-merge-holds-branch-and-base
**Merged:** 2f4494b in ../../../JarlSkill
**CI:** none

## What
A merger started a long check in the background and reported the merge as done while the check still ran; the coordinator could not tell whether it had finished. The merger reference already says to run the check in the foreground and wait.

## Why
The record should show a merge without its check result as unfinished, so nobody reads it as landed.

## Acceptance
- merged --sha with neither a check row nor --red is shown by status and show as waiting for its check, with the command that records it
- The merger reference says once that the report comes after the check, never before
- Tests for the mark and for its clearing

## Changelog
- Fixed: A merge recorded before its test run has finished now shows as waiting for its check in the status, the resume and the issue itself, with the command that records the check. It stops showing once the check, or the red check it landed on, is recorded.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.
- **ran (history):** node --test tests/merge-holds.test.mjs, lib change removed · **saw:** pass 6, fail 1: waiting for its check is not shown
- **ran (history):** node --test tests/merge-holds.test.mjs · **saw:** pass 7, fail 0; status on a copy of the loop prints merged, waiting for its check: 028
- **ran (history):** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 832, pass 809, fail 0, skipped 23 (merge 2f4494b on release/6.2.1)

