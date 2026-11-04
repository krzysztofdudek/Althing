# 142 · Jarl: a blank drop reason is accepted, and so is a changelog entry under an unknown section

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096g-opus
**Where:** Review of 096 (rev-jarl-096g-opus), Outside the issue

## What
set <id> dropped with a blank reason is accepted, and body --changelog with a section heading the changelog does not know is recorded. Both were there before 096.

## Why
A dropped issue without a reason cannot be read later; a changelog entry under an unknown section never reaches the release notes.

## Acceptance
A blank drop reason is refused with the form that gives one, a changelog section outside the known list is refused with the list, and a test holds each

## Evidence

