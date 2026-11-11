# 660 · names-range.mjs remoteHolds (the pre-push of every tool repository, since 363) leaves out the commi…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T2100-wdab
**Tags:** 
**Files:** 
**Repo:** Althing
**Found by:** rev-658-opus
**Where:** the review of 657, 658
**Branch:** jarl/658-names-remote-asked
**Worker:** w-658-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 21:01

## What
names-range.mjs remoteHolds (the pre-push of every tool repository, since 363) leaves out the commits that pull-request refs reach, as in Important 1 of 657/658: a contributor's or dependabot's pull request merged locally in a tool repository and pushed is not scanned for the commits a host lists under refs/pull; asking only for heads and tags in remoteHolds closes both.

## Why


## Acceptance


[test] The tool repositories' pre-push (remoteHolds) excludes only commits reachable from the remote's heads and tags, never from pull-request refs, so a fork's commit under refs/pull only is scanned when pushed, red before and green after · by: yg check && npm test

## Evidence

### Proof

- **ran (line 942df257c862):** node --test --test-name-pattern 'pull-request ref' rails/test/run.test.mjs workspace/test/names-range.test.mjs, at f7a6d29 (tests only, remoteHolds asking for every ref) · **saw:** both tests failed: 'rails range (2 commits): clean.' and 'names range (2 commits): clean.' for a leaked commit only a pull ref reaches
- **ran (line 942df257c862):** systemd-run --user --scope -p MemoryMax=8G --quiet nice -n 15 timeout 1800 npm test · **saw:** tests 203, pass 191, fail 0, skipped 11, todo 1 (the existing direct.test.mjs one); the pull-request tests green in rails/test/run.test.mjs and workspace/test/names-range.test.mjs
- **ran (line 942df257c862):** timeout 300 yg check --no-approve · **saw:** yg check: PASS 17 nodes, 1360/1360 files covered, 5833 pairs verified (script), at 9c6d3b5

### Notes

Assumed: remoteHolds asks git ls-remote --heads --tags, so HEAD and every other namespace (refs/pull, refs/changes, refs/notes) exclude nothing; the examiner's repro shape is covered for Althing's hook and the tool repositories' template.

