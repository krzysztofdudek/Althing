# 533 · Jarl: the carry of a text the record already holds is tied to where that text stands in the line

**Status:** deferred
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261109T1711-gojr
**Tags:** jarl, record
**Files:** JarlSkill/skills/jarl/scripts/lib/owner.mjs
**Repo:** JarlSkill
**Found by:** rev-531-fable
**Where:** skills/jarl/scripts/lib/owner.mjs:119

## What
needNoNewOwnersWords takes a carried text out of every place in a line, not only the place where the record's own text stands. Issue 531 closed the known path by checking every writer's name where it is read. Tying the carry to the position would close the whole class.

## Why
A later line shape that puts an unchecked new text beside a carried old text would pass the guard again.

## Acceptance
[test] A carried text is removed only at the position it was written, and the same text elsewhere in the line is still refused · by: cd skills/jarl/scripts && npm test

## Evidence

### Notes

Deferred: For the next release of Jarl: no known path remains after 531.

