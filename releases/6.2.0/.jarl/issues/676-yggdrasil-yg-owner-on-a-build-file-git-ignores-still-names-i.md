# 676 · Yggdrasil: yg owner on a build file git ignores still names its node by path, while the relation pass now reads only the files git lists

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T2328-icrc
**Tags:** yggdrasil, relations
**Files:** 
**Repo:** Yggdrasil
**After:** 530
**Found by:** jarl
**Where:** w-530-sonnet, Runes 1.1.0 adoption report

## What


## Why
After 235 an ignored build file takes no part in relations, so yg owner naming its node by path tells the user a file counts when it does not.

## Acceptance
[test] yg owner on a file git ignores says it takes no part in relations (or names no node for it), consistent with the relation pass, red before and green after · by: cd source/cli && npm test

## Evidence

