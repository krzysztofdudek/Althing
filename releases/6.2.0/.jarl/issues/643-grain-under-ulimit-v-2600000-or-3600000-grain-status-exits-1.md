# 643 · Grain: under ulimit -v 2600000 or 3600000 grain status exits 1 with no message at all, on release/6…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1940-vdwp
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-573-opus
**Where:** the review of 573, 587, 588, 605, 606, 612, 631
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
Grain: under ulimit -v 2600000 or 3600000 grain status exits 1 with no message at all, on release/6.2.0 and on jarl/573-grain-large-files (3.6 GB on both, 2.6 GB on release): the re-started process (--liftoff-only) aborts with SIGABRT (exit 134 when started directly), and bin/grain.mjs:71 turns a child ended by a signal into a plain exit 1 without a word; GRAIN_V8=off answers. A silent failure the change did not touch.

## Why


## Acceptance


[test] Under ulimit -v 2.6 GB and 3.6 GB grain status answers or stops with a message naming the limit, never a bare exit 1 from a re-started process that aborted, red before and green after · by: cd plugins/grain && npm test

## Evidence

