# 163 · Jarl: the cleanup after a merge and the done gate's merge check still read the main checkout's branch, not the repository's declared base

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-074-sonnet
**Where:** Report of the worker of 079 (package B), Found

## What
Issue 079 made the merge note read the declared base, but cleanUpAfterMerge (lib/commands.mjs, near line 1768) and the done gate's mergeRefusal still read the branch the main checkout has open, so after the base is declared they can disagree with the note about whether a branch is merged.

## Why
One rule for 'merged into the base' should serve the note, the cleanup and the gate.

## Acceptance
The note, the cleanup after a merge and the done gate's merge check use the same base (the declared base, else the branch the main checkout has open), with a test where the two differ

## Evidence

