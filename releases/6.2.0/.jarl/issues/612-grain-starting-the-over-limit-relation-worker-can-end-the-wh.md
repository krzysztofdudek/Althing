# 612 · Grain: starting the over-limit relation worker can end the whole process under an address-space limit of about 1.6 to 1.9 GB, and grain measure's log tells the user grain refresh reads a version it never reads

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1545-tuwk
**Tags:** grain, relations
**Files:** 
**Repo:** Grain
**After:** 169
**Found by:** jarl
**Where:** rev-169d-opus, 169 after the takeover (oversize-relations.mjs:76 and :73; partition.mjs:253)
**Branch:** jarl/573-grain-large-files
**Worker:** w-573-fable
**Model:** claude-fable-5-2@low
**Since:** 2026-11-11 18:44

## What


## Why
Under that limit grain status exits 1 with 'Failed to reserve virtual memory for CodeRange' and no index, where release/6.2.0 indexes and names the file; and a log line that names the wrong command sends the user to a step that does nothing.

## Acceptance
- [test] Under ulimit -v 1600000 to 1900000 grain status on a repository with an over-limit file answers with the file named as unfinished, never a fatal exit, red before and green after · by: cd plugins/grain && npm test
- [read] When grain measure reads an earlier commit's file itself and the read stops, its log line names the next grain measure, as its note does

## Evidence

