# 202 · Jarl: the three-writer note test of issue 183 peaks at about 960000 inodes of the shared temporary filesystem, so any suite running beside it fails with ENOSPC

**Status:** open
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** skills/jarl/scripts/tests/note-writers.mjs and the test in tests/retract.test.mjs that writes 4242 histories

## What
The test writes every history of notes in its own loop folder and keeps them until the end: run alone it peaks at 963488 of the 1048576 inodes of the machine's temporary filesystem (92%), and the full suite run beside any other suite then fails with ENOSPC in unrelated tests.

## Why
The host rule says a suite that leaves thousands of files behind is a fault of that suite; the same holds for a peak that starves other suites.

## Acceptance
The test removes each history's folder (or reuses one folder) as soon as it has checked it, its peak stays under a few thousand inodes, it still checks the same 4242 histories, and a full suite run beside another full suite passes

## Evidence

