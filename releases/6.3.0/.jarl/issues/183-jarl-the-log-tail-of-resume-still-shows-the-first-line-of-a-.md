# 183 · Jarl: the log tail of resume still shows the first line of a retracted note that starts with a list bullet, is escaped when written, or ends with the long-note wording

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-104-opus-e2
**Where:** skills/jarl/scripts/lib/resume.mjs retractedNoteEvents: the key of the note is built by stripping a leading bullet and the strike marks, but the log keeps them

## What
A retracted note whose text starts with a list bullet, whose first line is escaped when written (a leading heading mark or a conflict marker), or whose own text ends with the wording of the long-note suffix keeps its first line in resume's log tail. The count is right.

## Why
A retracted note and its reason should be out of what a worker reads in every case.

## Acceptance
The key of a note is built the way the log writes it, and a test holds the bullet, the escaped and the suffix-wording cases

## Evidence

