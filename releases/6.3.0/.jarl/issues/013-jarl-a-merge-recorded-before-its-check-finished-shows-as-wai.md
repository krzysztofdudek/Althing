# 013 · Jarl: a merge recorded before its check finished shows as waiting for the check

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
A merger started a long check in the background and reported the merge as done while the check still ran; the coordinator could not tell whether it had finished. The merger reference already says to run the check in the foreground and wait.

## Why
The record should show a merge without its check result as unfinished, so nobody reads it as landed.

## Acceptance
- merged --sha with neither a check row nor --red is shown by status and show as waiting for its check, with the command that records it
- The merger reference says once that the report comes after the check, never before
- Tests for the mark and for its clearing

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.

