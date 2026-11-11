# 596 · Grain: an unknown command builds or refreshes the whole index before it answers 'unknown command' (…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1434-tyla
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-568-fable
**Where:** the review of 568, 569
**Branch:** jarl/596-grain-tidy
**Worker:** w-596-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 18:04

## What
Grain: an unknown command builds or refreshes the whole index before it answers 'unknown command' (engine/grain.mjs, the default of the dispatcher runs after ensureFresh). A host that still calls a removed hook command, from a registration of its own or a stale copy, now pays a full build on each call and gets exit 1. The refusal belongs before the index is touched.

## Why


## Acceptance


[test] An unknown grain command is refused with exit 1 before the index is read, built or refreshed: in a repository with no index it leaves none behind and answers within a second, red before and green after · by: cd plugins/grain && npm test

## Changelog
- An unknown grain command is now refused at once with exit 1, before Grain reads or builds the index, so a call to a removed command no longer costs a build and leaves no .grain folder behind.

## Evidence

### Proof

- **ran (line c56c2b963eeb):** cd plugins/grain && node --import ./tests/git-env.mjs --test tests/unknown-command-refusal.test.mjs · **saw:** before the fix (commit d507a933): 4 of 5 failed, 'the refusal left an index behind'; after the fix (commit fe181784): pass 5, fail 0 - an unknown command exits 1 with 'unknown command', leaves no .grain folder, answers in under a second
- **ran (line c56c2b963eeb):** cd plugins/grain && YG_BIN set, systemd-run MemoryMax=12G full-gate.sh nice -n 15 timeout 3000 npm test · **saw:** tests 2237, pass 2231, fail 0, skipped 6, exit 0

