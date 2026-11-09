# 129 · Jarl: next --limit and resume --ready are two names for how many ready issues to show

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261104T1245-pgzm
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096-opus
**Where:** Review of 096 (rev-jarl-096-opus), Outside the issue

## What
COMMAND_FLAGS in jarl.mjs gives next --limit and resume --ready the same meaning under two names.

## Why
The normalized surface wants one name per meaning.

## Acceptance
One name serves both commands, the other is refused with the ready form, and the flag-meaning test holds it

## Evidence

Dropped: a known limitation under the owner's ruling known-limitations-list-for-wording-minors: only wording, taste or an input no one is expected to give; it is written in releases/6.3.0/plans/known-limitations.md for the release notes

