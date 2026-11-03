# 002 · Jarl: pausing and resuming an issue keeps its proof and its approve while the branch tip is unchanged

**Status:** in-progress
**Kind:** bug
**Priority:** 1
**Tier:** strong
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/002-pause-keeps-proof
**Worker:** w-jarl-002-opus
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-002
**Since:** 2026-11-03 06:05

## What
Moving an in-progress issue back to open (or deferred) and leasing it again counts as a restart: every Proof row and the live approve recorded before it stop counting, so status says no evidence since the start and done is refused for want of an approve, although the branch and its tip are the same. An owner who reorders the queue several times a day spends every review that way.

## Why
Proof and a verdict are about code. A status move that leaves the code untouched must not spend them; a new commit on the branch must.

## Acceptance
- A pause and resume with the same branch tip keeps the rows and the approve that counted before it; a new commit on the branch, a round, or a reopen from done spends them as now
- Each row and verdict records the branch tip it was made on, and the gate compares that with the tip now; a loop whose rows carry no tip reads as now
- Tests for pause and resume, for a new commit after a pause, and for a record written without tips

## Changelog
- Fixed: Pausing a task and picking it up again no longer throws away its test results and its review, as long as nobody changed its code in between. A new change to the code still asks for new results and a new review.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.
- **ran:** cd skills/jarl/scripts && node --test tests/gate-window.test.mjs (jarl-lib.mjs at release/6.2.1, new tests in place) · **saw:** red: 7 pass, 6 fail: pause and resume through open and deferred, round and reopen after a pause, the window no pause opens, merge with deleted branch, tip lines written, pinned 6.1.0 reader
- **ran:** cd skills/jarl/scripts && node --test tests/gate-window.test.mjs (at 30df014) · **saw:** green: 12 pass, 0 fail, 1 skipped (the live-loop test, JARL_LIVE_LOOP unset)
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test (at 30df014) · **saw:** 808 tests: 780 pass, 5 fail, 23 skipped; the 5 failures are the README tests of issue 028 (docs-true x3, seams rule 7, tense on README.md), which fail on release/6.2.1 too
- **ran:** copy of releases/6.2.0/.jarl, issue 316 on release/6.2.1: set in-progress, evidence, review approve, set open, set in-progress, set done; driver Jarl, then this branch · **saw:** driver: done refused, no row since moved to in-progress; this branch: 316 done, log carries 316 tip 3ae1f4e after the row and the verdict; the driver reads the copy with tip lines (status, list) without error

