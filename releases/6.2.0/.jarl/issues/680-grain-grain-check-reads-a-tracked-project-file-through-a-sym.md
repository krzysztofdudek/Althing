# 680 · Grain: grain check reads a tracked project file through a symbolic link when the file was replaced on disk by a link to an ignored generated one and not yet staged

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T2331-imuo
**Tags:** grain, check
**Files:** 
**Repo:** Grain
**After:** 143
**Found by:** jarl
**Where:** rev-143b-opus, review of 674
**Branch:** jarl/662-grain-small
**Worker:** w-662-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
674 leaves out links only among untracked files, so a tracked file swapped for a link reaches check and gives a dependency the index after the commit does not have.

## Acceptance
[test] A tracked project file replaced on disk by a link to an ignored generated file, not staged, gives grain check no dependency the index after the commit lacks, red before and green after · by: cd plugins/grain && npm test

## Evidence

