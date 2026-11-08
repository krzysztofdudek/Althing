# 355 · Horde: main is red since Jarl 6.2.0 reached Jarl's main, because CI compares Horde's copy of Jarl with Jarl's main

**Status:** dropped
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../Horde
**Found by:** coordinator
**Where:**

## What
CI on Horde's main failed on 596f3d8 (run 39554640352): the jarl vendor gate checks the vendored copy (pinned to Jarl v6.1.0) against JarlSkill's main whenever a branch of the same name exists there, and Jarl's main now holds 6.2.0, so record.mjs and jarl-lib.mjs differ. Every Jarl release turns Horde's main red until Horde re-vendors. The Windows job of the same run took an hour.

## Why
A gate that goes red on another repository's release, not on a change in Horde, hides real failures behind a known red.

## Acceptance
- The vendor gate compares the copy with the commit the pin names; a separate, advisory job may compare it with Jarl's main and says so
- Horde's main is green after 343 re-vendors Jarl; the Windows job's hour is explained or bounded
- CI is green on the commit, recorded as a row

## Evidence

Dropped: Mimir, Gard and Horde are out of this loop (ruling mimir-gard-horde-out-of-the-6-2-0-loop)

