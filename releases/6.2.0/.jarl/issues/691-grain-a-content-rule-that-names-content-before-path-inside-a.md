# 691 · Grain: a content rule that names content before path inside all_of fetches every file, including those the path leaves out

**Status:** open
**Kind:** cleanup
**Priority:** 3
**Tier:** light
**Key:** 20261112T0047-jdxu
**Tags:** grain, performance
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Where:** rev-143e-fable, review of the batch reads (plugins/grain/engine/yggdrasil-graph.mjs:413)

## What


## Why
The answer is right and the reads are batched, but a rule limited to a path should not read files outside it whatever order its parts are written in.

## Acceptance
[test] A content rule with content before path inside all_of fetches only the files the path admits, as with path first, red before and green after · by: cd plugins/grain && npm test

## Evidence

