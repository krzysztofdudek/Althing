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
- Delegation: a jarl files a backlog, splits it into two slices and assigns two coordinators; each coordinator's next covers only its slice; the jarl's view shows only entries with the ball on the jarl; the owner's digest shows only entries with the ball on the owner
- Replacement: a coordinator is stopped mid-slice and a fresh one, given only the slice's brief, continues; nothing it needs (standing rules, promises, open questions, reviews in flight) is missing
- Stuck worker: a lease with no row, log line or commit past the loop's threshold in minutes shows in its coordinator's next with the command to act
- Two machines: two clones file, lease and merge on one loop; no two issues share a number, and a lease taken in both clones shows as a conflict for the jarl
- Owner returns: one command prints, in one message, every entry with the ball on the owner, most blocking first, each with what it holds up
- Each scenario is a test that is red on release/6.2.1 71ebc5b, and the live run's record is kept in the research folder

## Evidence

