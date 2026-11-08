# 202 · Jarl: the three-writer note test of issue 183 peaks at about 960000 inodes of the shared temporary filesystem, so any suite running beside it fails with ENOSPC

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** skills/jarl/scripts/tests/note-writers.mjs and the test in tests/retract.test.mjs that writes 4242 histories
**Branch:** jarl/202-note-test-footprint
**Worker:** w-jarl-202-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/202-note-test-footprint
**Since:** 2026-11-08 12:58

## What
The first reading of this issue blamed the three-writer note test of issue 183: that was wrong (its own folder peaks at 20 entries; the high figure came from another agent's folder on the same filesystem). The measured peaks of single test files, counted in each file's own folder, are: refusals-walk-reviewers-b about 204000, refusals-walk-reviewers-a about 200000, refusals-walk-fixtures about 91000, refusals-walk-rooted about 69000, refusals-walk about 39000, refusals about 21500; every other file is under 10000. The refusals-walk files run side by side in the full suite, so a full suite peaks near 530000 of the 1048576 inodes of the shared temporary filesystem, and any second suite beside it fails with out-of-space errors in unrelated tests.

## Why
The host rule says a test makes its own folder and removes it when it ends and a suite that leaves thousands of files behind is a fault of that suite; a peak that starves every other process on the machine is the same fault.

## Acceptance
Each refusals-walk file removes the copy it made for a call as soon as the call is checked (or reuses one copy), keeps every assertion and the same number of generated wrong calls, and its own folder peaks under 20000 entries; a full suite beside another full suite passes; the peak of every other test file is reported

## Changelog


## Evidence

- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern 'notes written by this Jarl' tests/retract.test.mjs, TMPDIR from mktemp -d, the entries under that folder counted by find every 0.3 s while it ran (at 1e6d579, the branch point, no change made) · **saw:** pass 1 of 1 (the 4242 histories: 30 + 900*3 + 216*7, asserted by the test), peak 20 entries under the test's own temporary folder; the test already reuses two loop folders for all histories. The shared filesystem's inode count is not usable as a measure here: other agents' suites ran beside it and moved it by thousands per second
- **ran:** cd skills/jarl/scripts && node --test tests/retract.test.mjs, TMPDIR from mktemp -d, entries under that folder counted every 0.3 s (at 1e6d579) · **saw:** pass 22 of 22 in 109 s, peak 544 entries in the whole file, against the 960000 the issue reports for the note test
- **ran:** cd skills/jarl/scripts && node --test <file> for each of the 110 test files in turn, TMPDIR from mktemp -d, entries under that folder counted every 0.3 s; about 28500 entries of an earlier killed run stood in the folder as baseline (at 1e6d579) · **saw:** peaks above 50000 after subtracting that baseline: refusals-walk-reviewers-b about 204000, refusals-walk-reviewers-a about 200000, refusals-walk-fixtures about 91000, refusals-walk-rooted about 69000, refusals-walk about 39000 (below 50000); refusals about 21500; every other file, retract included, under 10000
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, TMPDIR from mktemp -d, entries under that folder counted every second (at 1e6d579) · **saw:** tests 1606, pass 1584, fail 0, skipped 22, 149 s, peak 529000 entries at once, reached in the last minute while the refusals-walk files run side by side; the note test is not what fills it

