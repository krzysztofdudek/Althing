# 023 · Jarl: a section or field can be added to the profile of a live loop

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**

## What
The owner asked for a new section on every issue of a loop that already held 256 issues. Sections come only from a profile, and a profile only from init --profile, so the profile was written into the loop by hand and checked with profile and verify.

## Why
Loops grow; a change of their shape should be a command with a log line, not a hand edit of the profile file.

## Acceptance
- A command extends the profile of a live loop with a section or field, checks it as profile <file> does, and writes a log line
- verify is clean after it; a test

## Evidence

