# 231 · Grain: an ambiguous symbol resolved per graph node, as in yg check (the second half of 117)

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** grain, relations, partial
**Files:** 
**Repo:** ../../../Grain
**Found by:** jarl
**Source:** decisions#grain-scope
**Where:**
**After:** 169

## What
In 6.1.1 (117) Grain only reports the number of unresolved references; per-node resolution deferred.

## Why
grain measure shows 0 dependencies where yg check refuses.

## Acceptance
When all declarations of a symbol lie in the directories of one node, Grain counts a dependency on that node, as yg check does; measure, advise and propose agree with yg check on the fixture from 117 (C# split); tests.

## Evidence


