# 531 · Jarl: field refuses to change a part whose old text ends in the singular owner phrase and a full stop

**Status:** deferred
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261109T1633-vbyq
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/lib/owner.mjs
**Repo:** JarlSkill
**Found by:** jarl
**Where:** skills/jarl/scripts/lib/owner.mjs:79

## What
The log line field writes quotes the value a part held before. An Acceptance ending in the possessive of owner, the singular noun word and a full stop gains a closing quotation mark in that line. MARKER_FORM then reads it as the quote marker and field refuses the write, with --add as well. The comment above MARKER_FORM calls the singular phrase honest. Issue 142 of this loop hit it on 2026-11-09 and was replaced by a new issue.

## Why
One honest sentence in an old issue blocks every later change to that part, and the only way out is to drop the issue and file a new one.

## Acceptance
[test] field replaces and adds to an Acceptance whose old text ends in that phrase and a full stop, and a forged marker is still refused · by: cd skills/jarl/scripts && npm test

## Evidence

### Notes

Deferred: For the next release of Jarl: it is not part of this release of Runes, Yggdrasil and Grain.

