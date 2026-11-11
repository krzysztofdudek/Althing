# 567 · Grain tests on a loaded machine: tests/placement-moves.test.mjs failed 4 of 4 in a full suite run w…

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261111T1227-merm
**Tags:** 
**Files:** 
**Repo:** Grain
**Found by:** rev-169-fable
**Where:** the review of 169
**Branch:** jarl/557-grain-rest
**Worker:** w-557-sonnet
**Model:** claude-sonnet-5-5@high
**Since:** 2026-11-11 20:09

## What
Grain tests on a loaded machine: tests/placement-moves.test.mjs failed 4 of 4 in a full suite run with "Security violation: Requested utility `git` does not match executable name" from the coreutils env behind the machine git proxy, and passes when run alone; possibly the same cause as issue 554.

## Why


## Acceptance


[test] tests/placement-moves.test.mjs passes in the full suite on a loaded machine behind the machine's git proxy, or the cause is shown to be gone with 554 and the test passes five full suites in a row · by: cd plugins/grain && npm test

## Evidence

### Proof

- **ran (line b91ced26698c):** cd plugins/grain && systemd-run --user --scope -p MemoryMax=12G bash full-gate.sh nice -n 15 timeout 3000 npm test, five full suites one after the other on branch tip df6babe1, behind the machine git proxy, with YG_BIN and GRAIN_CORPUS_CLONES set · **saw:** run 1 to 5 each: tests 2338, pass 2331, fail 0, skipped 7 (about 234 s each); tests/placement-moves.test.mjs passes in every run and no run prints 'Security violation'

### Notes

Assumed: the cause is gone with 554 (the review that saw it ran a tree whose stand-in git still called itself without end, which fills the machine with processes); I could not reproduce the message with the pre-554 stand-in running beside placement-moves (3 of 3 green), so no code changed for 567. The acceptance allows this: five full suites in a row pass.

