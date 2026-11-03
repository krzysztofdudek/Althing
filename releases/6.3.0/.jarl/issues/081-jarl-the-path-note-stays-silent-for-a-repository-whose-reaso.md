# 081 · Jarl: the path note stays silent for a repository whose reason for being stored as a path changed, and every --repo value reads all issues

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 025
**Found by:** rev-jarl-025-opus
**Where:** Review of 025 and 026 (2026-11-03)
**Branch:** jarl/037-notes-and-defaults

## What
025 prints the path note once per repository; if a later filing is stored as a path for another reason, the note stays silent. Deciding whether the note was printed reads every issue of the loop on every --repo value. The sentence of 026 sits in two references rather than one with a link.

## Why
A silent changed reason misleads; reading every issue costs time on large loops.

## Acceptance
The note is printed again when the reason differs, the check reads a cheap index or the log instead of every issue, and 026's sentence lives in one reference linked from the other, with tests

## Evidence

