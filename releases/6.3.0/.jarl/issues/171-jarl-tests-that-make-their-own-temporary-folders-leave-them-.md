# 171 · Jarl: tests that make their own temporary folders leave them behind when a test file runs alone

**Status:** dropped
**Kind:** cleanup
**Priority:** 3
**Tier:** standard
**Key:** 20261106T1714-zbmk
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-004-opus-a3
**Where:** skills/jarl/scripts/tests/review-waiver.test.mjs: codeLoop, and the gitRepo and loop helpers
**Branch:** jarl/163-base-and-reopen

## What
A test file run on its own leaves its jarl-waiver-profile folders and similar ones in the system temporary directory; only tests/suite.mjs deletes them.

## Why
The host's rules say a test makes its own folder and removes it when it ends, and the temporary directory has a limit on files.

## Acceptance
A test file run alone removes the folders it made, with the helpers shared

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/<file>.test.mjs for review-waiver, merge-cleanup, closed-gate, gate-window and no-loop, each alone, with the temporary directory set to an empty folder listed before and after each · **saw:** it no longer reproduces: pass 17, 21, 7, 23 and 27, fail 0, and the folder holds 0 entries before and after every file. Each test process makes a temporary folder of its own and removes it when it ends (tests/tmp-cleanup.mjs, imported by tests/helpers.mjs), and no test file reaches the temporary directory without it, so no change was made
- **ran (history):** cd skills/jarl/scripts && npm test (the whole suite on the branch tip 58824ff) · **saw:** tests 1548, pass 1526, fail 0, skipped 22; the suite left nothing in its temporary directory

Dropped: does not reproduce: each test process already gets its own temporary folder and removes it (tests/tmp-cleanup.mjs through helpers.mjs); a fresh reviewer ran five test files alone and found no entry left before or after

