# 202 · Jarl: the three-writer note test of issue 183 peaks at about 960000 inodes of the shared temporary filesystem, so any suite running beside it fails with ENOSPC

**Status:** done
**Kind:** bug
**Priority:** 1
**Tier:** standard
**Key:** 20261108T1232-tzuh
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** coordinator
**Where:** skills/jarl/scripts/tests/note-writers.mjs and the test in tests/retract.test.mjs that writes 4242 histories
**Branch:** jarl/202-note-test-footprint
**Merged:** b3104b1a27efdb9e0a713253ef30f50dd1b94113 in ../../../JarlSkill
**CI:** none

## What
The first reading of this issue blamed the three-writer note test of issue 183: that was wrong (its own folder peaks at 20 entries; the high figure came from another agent's folder on the same filesystem). The measured peaks of single test files, counted in each file's own folder, are: refusals-walk-reviewers-b about 204000, refusals-walk-reviewers-a about 200000, refusals-walk-fixtures about 91000, refusals-walk-rooted about 69000, refusals-walk about 39000, refusals about 21500; every other file is under 10000. The refusals-walk files run side by side in the full suite, so a full suite peaks near 530000 of the 1048576 inodes of the shared temporary filesystem, and any second suite beside it fails with out-of-space errors in unrelated tests.

## Why
The host rule says a test makes its own folder and removes it when it ends and a suite that leaves thousands of files behind is a fault of that suite; a peak that starves every other process on the machine is the same fault.

## Acceptance
Each refusals-walk file removes the copy it made for a call as soon as the call is checked (or reuses one copy), keeps every assertion and the same number of generated wrong calls, and its own folder peaks under 20000 entries; a full suite beside another full suite passes; the peak of every other test file is reported

## Changelog


## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test --test-name-pattern 'notes written by this Jarl' tests/retract.test.mjs, TMPDIR from mktemp -d, the entries under that folder counted by find every 0.3 s while it ran (at 1e6d579, the branch point, no change made) · **saw:** pass 1 of 1 (the 4242 histories: 30 + 900*3 + 216*7, asserted by the test), peak 20 entries under the test's own temporary folder; the test already reuses two loop folders for all histories. The shared filesystem's inode count is not usable as a measure here: other agents' suites ran beside it and moved it by thousands per second
- **ran (history):** cd skills/jarl/scripts && node --test tests/retract.test.mjs, TMPDIR from mktemp -d, entries under that folder counted every 0.3 s (at 1e6d579) · **saw:** pass 22 of 22 in 109 s, peak 544 entries in the whole file, against the 960000 the issue reports for the note test
- **ran (history):** cd skills/jarl/scripts && node --test <file> for each of the 110 test files in turn, TMPDIR from mktemp -d, entries under that folder counted every 0.3 s; about 28500 entries of an earlier killed run stood in the folder as baseline (at 1e6d579) · **saw:** peaks above 50000 after subtracting that baseline: refusals-walk-reviewers-b about 204000, refusals-walk-reviewers-a about 200000, refusals-walk-fixtures about 91000, refusals-walk-rooted about 69000, refusals-walk about 39000 (below 50000); refusals about 21500; every other file, retract included, under 10000
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, TMPDIR from mktemp -d, entries under that folder counted every second (at 1e6d579) · **saw:** tests 1606, pass 1584, fail 0, skipped 22, 149 s, peak 529000 entries at once, reached in the last minute while the refusals-walk files run side by side; the note test is not what fills it
- **ran (history):** a walk of every generated, rooted and fixture call (437 generated, 447 rooted, 444 + 443 reviewers' halves, 206 + 159 fixtures) at 1e6d579 and at 5a4b284, counting the calls refused and the problems found, entries of the run's own temporary folder counted every 0.3 s · **saw:** before and after the same: refused 437, 447, 391, 406, 202, 146 and 0 problems found in each; peak of the six walks together 275 entries after
- **ran (history):** cd skills/jarl/scripts && node --test <file> for each walk file and the refusals file alone, TMPDIR from mktemp -d, entries of that folder counted every 0.3 s (at 5a4b284); before, the same at 1e6d579 less the 28500 entries an earlier killed run had left in the folder · **saw:** peak entries before to after: refusals-walk-reviewers-b 204400 to 275, refusals-walk-reviewers-a 200200 to 269, refusals-walk-fixtures 91400 to 269, refusals-walk-rooted 69000 to 268, refusals-walk 39200 to 268, refusals 21500 to 1700, refusals-walk-views 6500 to 327; all pass (1 test, 1, 1, 1, 1, 3 and 27 tests); every other file was under 10000 before
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, TMPDIR from mktemp -d, entries of that folder counted every 0.5 s (at 5a4b284) · **saw:** tests 1606, pass 1584, fail 0, skipped 22, 138 s (149 s before); peak 16933 entries at once, against 529000 before
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1643, pass 1621, fail 0, skipped 22, merge b3104b1; the whole suite now peaks near 17000 entries instead of about 529000

