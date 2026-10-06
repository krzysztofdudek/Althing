# 182 · Grain: a commit older than the window that touches two former paths of one present-day file counts twice in co-changes

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** strong
**Tags:** grain, cochange, 6.2
**Files:** Grain/plugins/grain/engine/history.mjs
**Repo:** ../../../Grain
**After:** 048
**Found by:** rev-grain-048
**Where:**

## What
After 048 (the whole history on present-day paths) a commit from before the window that changes two former paths of the same present-day file counts twice: the reviewer's case gives 15/17 instead of 12/14. Documented by the worker.

## Why
A slight overstatement of pair support on long histories with many renames.

## Acceptance
Each commit counts once per present-day file outside the window too; a test on the reviewer's case.

## Evidence


