# 116 · Jarl: after a renumber, After fields, questions and branch names still carry the old number

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261104T0845-fppy
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 084
**Found by:** w-jarl-084-opus
**Where:** Worker report of 084 (2026-11-03): renumber

## What
After a renumber of an issue that took a number twice, other issues' After fields, questions that name the number and the branch names keep the old number, though the key tells the moves apart.

## Why
A renumber must leave no reference to the old number that now points at the wrong issue.

## Acceptance
renumber updates or reports every After field, question and branch name that carried the old number, with tests

## Evidence

Dropped: a known limitation under the owner's ruling known-limitations-list-for-wording-minors: only wording, taste or an input no one is expected to give; it is written in releases/6.3.0/plans/known-limitations.md for the release notes

