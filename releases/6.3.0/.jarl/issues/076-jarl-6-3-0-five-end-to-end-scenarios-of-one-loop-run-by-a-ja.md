# 076 · Jarl 6.3.0: five end-to-end scenarios of one loop run by a jarl, coordinators, workers and reviewers pass

**Status:** open
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** design, acceptance
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 035
**Found by:** owner
**Where:**

## What
Ruling loop-tool-one-model-five-scenarios makes five scenarios the acceptance of 6.3.0 as a whole. Each is written against the model of research/2026-11-03-jarl-as-a-loop-tool as a test that drives a scratch loop through the role commands, with no model in the loop, and once as a live run with real agents.

## Why
Single fixes do not show that the levels hold together; a scenario run from start to end does.

## Acceptance
- Delegation: a jarl files a backlog, splits it into two slices and assigns two coordinators; each coordinator's list covers only its slice; both coordinators try to lease the same ready issue and the second is refused; the jarl's list shows only entries with the ball on the jarl, and the owner's digest only entries on the owner
- Replacement: a standing rule, a promise, an open question and a review in flight are recorded for slice A; a fresh coordinator's brief for slice A carries all four and nothing of slice B; what was never recorded is out of reach of this test, and the test says so
- Stuck worker: with the test-only clock seam, a lease with no row, log line or commit past the loop's threshold in minutes (default 30) shows in its coordinator's list with the command to act, and resume uses the same threshold
- Two machines (ruling two-machines-caught-at-merge): two clones, and apart two branches of one checkout, file, lease and merge; a number taken twice is told apart by the issue key and renumbered at the merge, with no move landing on both; a lease taken in both clones shows to the jarl as a conflict; verify refuses an issue file holding git conflict markers
- Owner returns: one command prints, in one message, every entry with the ball on the owner, most blocking first, each with what it holds up
- Each scenario is a test that is red at 71ebc5b on a behavioural assertion made with existing commands where one exists (a double lease accepted, two issues numbered 2 on two branches, verify clean on a conflicted file, a stale lease not shown at 30 minutes) and green after; a clock seam read by the stamp and by the views' now exists for tests only; a live run with real agents is kept in research/2026-11-03-jarl-as-a-loop-tool

## Evidence

