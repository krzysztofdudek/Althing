# 631 · Grain: its own graph refuses engine/export.mjs (node:child_process in the analysis layer) and README.md:135's CHANGELOG.md link, and the stress oracle's graph has drifted from the tree

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1823-oefr
**Tags:** grain, graph
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Where:** w-596-sonnet, the Grain tidy package
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What


## Why
An enforced rule of Grain's own graph that refuses its own code is a red gate on the release; and an oracle that has drifted (101 type mismatches, 18 unmapped files, 3 drill cases that miss, all passing in the 2026-09 record) no longer scores what it claims.

## Acceptance
- [test] Grain's own yg check passes on the release tip: engine/export.mjs no longer imports node:child_process in the analysis layer (or the rule's scope is corrected with its reason) and README.md's links resolve · by: cd plugins/grain && npm test
- [read] The stress oracle's graph matches the tree again, or its README says plainly which parts are out of date and why its scores still mean something

## Evidence

