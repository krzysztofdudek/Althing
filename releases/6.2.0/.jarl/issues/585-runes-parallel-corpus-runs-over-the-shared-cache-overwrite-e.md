# 585 · Runes: parallel corpus runs over the shared cache overwrite each other's report files

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** light
**Key:** 20261111T1353-vxyv
**Tags:** runes, corpus
**Files:** 
**Repo:** Runes
**Found by:** jarl
**Where:** w-494-fable, the C# base-class package
**Branch:** jarl/233-jvm-and-tools
**Worker:** w-233-opus
**Model:** claude-opus-5-5@high
**Since:** 2026-11-11 19:23

## What


## Why
Several workers share one corpus cache on this machine; a run's report can be another run's, so a recorded proof may describe the wrong tree.

## Acceptance
[test] Two corpus runs over one cache at once each write their report to a place of their own, and each report names the tree it ran on · by: npm run check

## Evidence

