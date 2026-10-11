# 301 · Grain: a hook-started refresh has no deadline of its own, GRAIN_UNWATCHED is honoured by every command, and the 228 changelog and comments overclaim

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** grain, hooks
**Files:** Grain/plugins/grain/bin/grain.mjs, Grain/plugins/grain/engine/hook-context.mjs, Grain/docs/reference.md
**Repo:** ../../../Grain
**Found by:** rev-grain-228-opus3
**Where:** plugins/grain/bin/grain.mjs:72 and :10-11; plugins/grain/engine/hook-context.mjs; docs/reference.md; tests/hooks-refresh-under-lock.test.mjs:23 and :319
**After:** 228

## What


Four findings from the fourth review of 228. (1) The background refresh a hook starts has no deadline of its own: a refresh that hangs while its event loop still runs keeps renewing the lock, so hooks stay silent and every query answers STALE until someone kills it; one that hangs in synchronous work loses the lock after ten minutes but keeps burning a core. Give it a deadline. (2) bin/grain.mjs:72 honours GRAIN_UNWATCHED=1 for every command, not only the refresh a hook starts: set in a user's environment it brings issue 199's orphan back for queries (the SIGKILL case of tests/orphan-child.test.mjs fails with it exported): honour it only for the refresh command, and list it in the docs/reference.md environment table as internal. (3) The changelog fragment of 228 overclaims: 'about 150 MB where it used to peak near 650 MB' — the 650 MB refresh existed only on the branch and never shipped; on 16,158 files the hook's refresh peaks at 697 MB and the base's refreshing query at 705 MB: say it runs in the same low-memory mode as a query. (4) Stale comments: bin/grain.mjs:10-11 says no process outlives the one that owns it; the test file at :23 says the GRAIN_SUPERVISED test is the last one; at :319 a parameter is named ageMs but is t.

## Why


A refresh with no deadline can leave the index stale for good while looking healthy, and an internal variable that changes behaviour for every command is a trap in a user's environment.

## Acceptance


- A hung hook-started refresh is ended by its own deadline and releases the lock, with a test that hangs the refresh for real.
- GRAIN_UNWATCHED=1 in the environment changes nothing for a command other than refresh (orphan-child test red-to-green with the variable exported); the docs table lists it as internal.
- The 228 changelog line and the stale comments say what holds.

## Evidence

