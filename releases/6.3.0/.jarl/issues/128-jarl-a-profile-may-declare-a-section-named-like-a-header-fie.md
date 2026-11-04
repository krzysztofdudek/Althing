# 128 · Jarl: a profile may declare a section named like a header field or like Reviews, and field then hides the header or overwrites the review history the file shows

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096-opus
**Where:** Review of 096 (rev-jarl-096-opus), Outside the issue

## What
A profile section named Tags, Where or Priority (the validator accepts them) hides that header field from the field command. A section named Reviews lets field, and body --section before it, overwrite the review history the issue file shows; the done gate is unaffected (lib/profile.mjs:239).

## Why
A section that shadows a header field or the proof sections makes the file disagree with the log, and the shown review history can be rewritten.

## Acceptance
The profile validator refuses a section named like a header field or like a section the tool writes (Evidence, Notes, Reviews, Proof), with the list of reserved names, and a test holds it

## Evidence

