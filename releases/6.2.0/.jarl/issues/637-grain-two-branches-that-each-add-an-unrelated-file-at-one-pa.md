# 637 · Grain: two branches that each add an unrelated file at one path are read as one file, so a rename on one side hands its history to the other; and the merges' changes are read in one buffered call that can pass the string limit on very large histories

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261111T1905-gype
**Tags:** grain, history
**Files:** 
**Repo:** Grain
**After:** 182
**Found by:** jarl
**Where:** rev-182d-opus, 182 and 217 after the takeover (lineage.mjs:22-24, :154-160; lineage.mjs:211-227 with history.mjs:392)
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What


## Why
On symfony 13 paths at merges get a file born over another branch's file; and the merge read is 87 MB on symfony (+405 MB peak), 117 MB on kubernetes, about a fifth of the string limit, past which the whole history read throws.

## Acceptance
[test] Two branches adding unrelated files at one path keep two identities through a rename on one side (the reviewer's u.js/h.js probe gives h.js~q.js 9 and u.js~p.js 9), and the merges' changes are read streamed with peak memory bounded, red before and green after · by: cd plugins/grain && npm test

## Evidence

