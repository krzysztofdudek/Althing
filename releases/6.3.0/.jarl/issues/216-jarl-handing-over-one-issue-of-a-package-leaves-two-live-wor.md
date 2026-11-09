# 216 · Jarl: handing over one issue of a package leaves two live workers on one branch and set, status, branches and verify stay silent

**Status:** dropped
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261108T1538-jsok
**Tags:** simulation
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** opus-simulation-2026-11-08
**Where:** lib/commands.mjs cmdSet handover, branches, verify

## What
A handover of one issue of a package puts a second worker on a branch another worker still holds for the other issues.

## Why


## Acceptance
a handover that would leave two workers on one branch is refused with the form that moves the whole package, or verify reports it

## Evidence

Dropped: absorbed by piece 2 (issue 226), landed

