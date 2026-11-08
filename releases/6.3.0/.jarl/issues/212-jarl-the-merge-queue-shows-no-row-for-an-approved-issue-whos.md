# 212 · Jarl: the merge queue shows no row for an approved issue whose merge a red round spent while its branch is already in the base, though next --as jarl asks the merger to record it again

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-194-opus-n1
**Where:** lib/queue.mjs cmdQueue, if (!ahead) continue

## What
next --as jarl says to merge again and record it, but queue and resume's merge queue have no row for that branch.

## Why


## Acceptance
the merge queue shows a row, marked record only, for an approved issue whose branch is already in the base and whose merge is not recorded now

## Evidence

