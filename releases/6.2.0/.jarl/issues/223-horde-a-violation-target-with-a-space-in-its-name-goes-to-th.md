# 223 · Horde: a violation target with a space in its name goes to the worker instead of to architecture, because Horde reads targets from the next line with a regex (\S+); after Ygg 032 it should read edges[].allowedRelations

**Status:** dropped
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** horde, yggdrasil-032
**Files:** 
**Repo:** ../../../Horde
**Found by:** rev-ygg-032
**Where:**

## What
The reviewer of Yggdrasil's package 032: yg-check/1 now has reliable edges[] with allowedRelations (an empty list = forbidden). Horde still extracts the target from the next text through (\S+), so a target with a space lands with the worker. Nothing is lost or duplicated; after the upgrade the keys change at most once.

## Why



## Acceptance
node.mjs in Horde reads the target and the allowed relations from edges[] of yg-check/1 (allowedRelations; an empty list = forbidden) instead of from the next text; a test with a target containing a space.

## Evidence


Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

