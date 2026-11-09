# 101 · Jarl: the test 'resume stays fast on a loop of hundreds of issues' fails whenever the machine is loaded, and so turns the whole suite red

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261103T1438-epic
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** jarl
**Where:** tests/resume.test.mjs 'resume stays fast on a loop of hundreds of issues naming another repository and a long log': 7 to 10 s against a 6 s bound on this machine under a load average of 10 to 24; alone it takes about 4 s and passes
**Branch:** jarl/101-resume-timing-test
**Merged:** c58c4b6 in ../../../JarlSkill
**CI:** none

## What
A fixed time bound makes the suite's result depend on what else runs on the machine. In this loop it failed in about every full run under load (merges of 075, 029, 063 and others) and always passed alone, so a real regression and a busy machine look the same.

## Why
A flaky red hides real failures and costs a rerun every time; the parallel workers of a loop make load the normal state.

## Acceptance
- The bound compares resume with a baseline measured in the same run (for example a status call on the same loop, or a count of git processes started) so that load moves both, with a test that still fails when resume is made quadratic
- The suite passes under a load average of 20 with the test in place

## Evidence

- **ran (history):** node --test --test-name-pattern 'hundreds of issues' tests/resume.test.mjs, resume made to start a git process per issue · **saw:** fails: resume started 525 git processes on the large loop and 142 on the small one; 64 more issues in flight allow 74 more
- **ran (history):** same test, resume given a pass over the log for every issue (about 25x slower) · **saw:** fails: resume took 4325 ms on the large loop, 530 times a git process (8.2 ms)
- **ran (history):** same test on the unmodified code with 12 busy node loops running beside it (load average 10 to 14), twice; then npm test · **saw:** passes both times (17 and 18 s); full suite 990 pass, 23 skipped, 1 fail (a spawn without a timeout in the new test, fixed; seams and resume files then pass)
- **ran (history):** npm test (in skills/jarl/scripts of the release worktree, at c58c4b6 with 101 merged, TMPDIR under ~/Temp/tmp) · **saw:** 1014 tests, 991 pass, 0 fail, 23 skipped

