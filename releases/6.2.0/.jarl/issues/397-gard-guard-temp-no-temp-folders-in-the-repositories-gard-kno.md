# 397 · Gard guard temp: no .temp folders in the repositories Gard knows

**Status:** deferred
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** gard, workplace, guards, hooks
**Files:** Gard/src/guards/temp.mjs, Gard/test/guard-temp.test.mjs
**Repo:** ../../../Gard
**After:** 394
**Found by:** owner
**Where:** Mimir at 10257cd: test/fixtures/owner-guards-module-copy/30-temp-block.mjs

## What
In roots Gard knows, a write into .temp or another folder a repository's own instructions name for scratch work is refused, and the refusal names where to write instead (the session's scratchpad, or a place a tool such as Mimir names). In directories Gard does not know the guard says nothing.

## Why
The owner's repositories carried rules telling agents to write into .temp, and the folders filled with litter; Gard's rule wins over a repository's instructions where Gard is in use.

## Acceptance
Tests cover a refused write in a known root with its message and a silent pass in an unknown directory

## Evidence

Deferred: ruling work-on-the-host-gard-and-mimir-set-aside: Gard and Mimir are set aside and the family works directly on the host

