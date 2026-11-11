# 596 · Grain: an unknown command builds or refreshes the whole index before it answers 'unknown command' (…

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1434-tyla
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-568-fable
**Where:** the review of 568, 569

## What
Grain: an unknown command builds or refreshes the whole index before it answers 'unknown command' (engine/grain.mjs, the default of the dispatcher runs after ensureFresh). A host that still calls a removed hook command, from a registration of its own or a stale copy, now pays a full build on each call and gets exit 1. The refusal belongs before the index is touched.

## Why


## Acceptance


## Evidence

