# 022 · Jarl: numbers can be reserved for a series of issues

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**After:** 035

## What
An owner wanted series kept apart by number (a film from 1000, merged upstream changes from 2000). new always takes the next free number, and a hand-made file with a high number would move the counter for every later issue.

## Why
Series kept apart by number are easy to read and to talk about; tags alone were a workaround.

## Acceptance
- new can take a number from a named range the loop declares, and the next free number elsewhere is unaffected
- Tests

## Evidence

Kept by the model as the owner's series feature, not the id mechanism (report section 8; ids are made safe by 084).

