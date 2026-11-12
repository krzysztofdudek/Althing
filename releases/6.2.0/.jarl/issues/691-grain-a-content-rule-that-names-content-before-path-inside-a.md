# 691 · Grain: a content rule that names content before path inside all_of fetches every file, including those the path leaves out

**Status:** in-progress
**Kind:** cleanup
**Priority:** 3
**Tier:** light
**Key:** 20261112T0047-jdxu
**Tags:** grain, performance
**Files:** 
**Repo:** Grain
**Found by:** jarl
**Where:** rev-143e-fable, review of the batch reads (plugins/grain/engine/yggdrasil-graph.mjs:413)
**Branch:** jarl/662-grain-small
**Worker:** w-662-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-12 01:37

## What


## Why
The answer is right and the reads are batched, but a rule limited to a path should not read files outside it whatever order its parts are written in.

## Acceptance
[test] A content rule with content before path inside all_of fetches only the files the path admits, as with path first, red before and green after · by: cd plugins/grain && npm test

## Changelog
- When git cannot start for want of open files, grain now stops and says so instead of continuing as if the repository had no commit time or were not shallow; a content rule written with its content before its path reads only the files the path admits.

## Evidence

### Proof

- **ran (line 284a91d9dbe7):** node --import ./tests/git-env.mjs --test tests/content-rule-fetches-only-what-path-admits.test.mjs (red before the fix: 5 fail; green after) · **saw:** 7 pass; and cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test: 2405 tests, 2399 pass, 0 fail

### Notes

Assumed: a head-less probe answers true, false or unread per part, so any_of and not also fetch only what their other parts leave open; no stamp changes (the answer is the same).

