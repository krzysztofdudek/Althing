# 111 · Jarl: the resume timing test's time limit depends on how fast git starts, a quadratic of about a second passes it, and the test now takes 20 to 40 seconds

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 101
**Found by:** rev-jarl-101-opus
**Where:** Review of 101 (2026-11-03): tests/resume.test.mjs
**Branch:** jarl/108-small-gaps
**Worker:** w-jarl-108-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/108-small-gaps
**Since:** 2026-11-08 08:42

## What
The new bound is measured against one git process start, so it moves with the machine's git; a slowdown of about a second passes; the test takes 20 to 40 seconds.

## Why
A test about speed should catch a real slowdown cheaply and stay quiet under load.

## Acceptance
The test stays under 10 seconds, catches a slowdown of a few times the baseline, and is stable under load, with the red shown

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/resume.test.mjs, on the tip before the change (timing and git process counts printed once) · **saw:** the test took about 1.6 s alone, not 20 to 40 s; resume 200 ms on the large loop, 70 ms on the quarter-size one, a git process 1.4 ms, status 170 ms on the large loop; the old bound unit*400 was 560 ms here and moved with the machine's git. The claim of 20 to 40 s did not reproduce on this tip; the claim of the bound tied to git's start did
- **ran:** cd skills/jarl/scripts && node --test tests/resume.test.mjs, new bounds (quarter-size loop x7, status on the same loop x4, git processes counted with 3 spare), each run once with a slowdown put into resume and removed after · **saw:** red: a git process per issue: 'resume started 527 git processes on the large loop and 144 on the small one; 64 more issues in flight allow 67 more'; a constant 600 ms: 'resume took 806 ms on the large loop and status, which reads the same loop, 166 ms: 4.8x'; a pass over every issue for each issue: 'resume took 1534 ms on the large loop and 155 ms on one a quarter its size: 9.9x for 4x the issues'
- **ran:** cd skills/jarl/scripts && node --test tests/resume.test.mjs, three runs alone and six at once, on commit 6b43145 with the slowdowns removed · **saw:** pass, 2.2 s alone and 3.2 s with six at once, fail 0 each time. Chosen: counting git processes (deterministic) plus two ratios taken in turn within one run, so load slows both sides; no number of milliseconds and no clock of git's start
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, once for the group, on commit 56dd68a · **saw:** tests 1503 pass 1481 fail 0 skipped 22
- **ran:** cd skills/jarl/scripts && node --test tests/resume.test.mjs, new bound (resume under 3 calibrations of bare git starts, one for each git process resume starts, plus a plain fs read and scan of every issue file and the log of the large loop; and under 7 times the quarter-size loop; process count kept), each run once with a slowdown put into shared code and removed after · **saw:** red: a constant 600 ms in readLoop: 'resume took 2091 ms on the large loop; 102 bare git processes and a plain read of its files take 220 ms: 9.5x'; a wait that grows with the log (a spin of one eighth of a millisecond for each log line): 'resume took 1404 ms ... take 213 ms: 6.6x'; a git process per issue: 'resume started 527 git processes on the large loop and 144 on the small one; 64 more issues in flight allow 67 more'; a pass over all issues for each issue: 'resume took 1899 ms on the large loop and 197 ms on one a quarter its size: 9.7x for 4x the issues'
- **ran:** cd skills/jarl/scripts && node --test tests/resume.test.mjs, three times alone, then five rounds of three copies at once under twelve busy node processes on 13 cores, on commit 914452b with the slowdowns removed · **saw:** pass each time, fail 0 in 15 of 15 runs under load; resume 285 ms against a calibration of 220 ms alone (1.3x, 3x allowed). Slowdown shared by resume and status no longer passes: the calibration runs none of Jarl's code
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, on commit d3b8086 (after merging the release branch, green before the fixes too: tests 1547 pass 1525 fail 0) · **saw:** tests 1550 pass 1528 fail 0 skipped 22

