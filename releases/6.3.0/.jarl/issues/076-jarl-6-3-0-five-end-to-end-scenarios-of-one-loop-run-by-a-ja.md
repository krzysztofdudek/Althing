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
- Delegation: a jarl files a backlog, splits it into two slices and assigns two coordinators; each coordinator's list covers only its slice; both coordinators try to lease the same ready issue and the second is refused; the jarl's list shows only entries with the ball on the jarl, and the owner's digest only entries on the owner; one approve in each slice at once gives one merge at a time
- Replacement: a standing rule, a promise, an open question and a review in flight are recorded for slice A; a fresh coordinator's brief for slice A carries all four and nothing of slice B; what was never recorded is out of reach of this test, and the test says so
- Stuck worker: with the test-only clock seam, a lease with no row, log line or commit past the loop's threshold in minutes (default 30) shows in its coordinator's list with the command to act, and resume uses the same threshold
- Two machines (ruling two-machines-caught-at-merge): two clones, and apart two branches of one checkout, file, lease and merge; a number taken twice is told apart by the issue key and renumbered at the merge, with no move landing on both; a lease taken in both clones shows to the jarl as a conflict; verify refuses an issue file holding git conflict markers
- Owner returns: one command prints, in one message, every entry with the ball on the owner, most blocking first, each with what it holds up
- One agent alone (ruling sixth-scenario-one-agent-alone): a loop runs from init to close with init, new, next, evidence, review, set done, ask and decide and no goal line beyond the goal; a code issue with proof and no verdict shows on the owner as a fresh session to start for the named issues
- Each scenario is a test that is red at 71ebc5b on a behavioural assertion made with existing commands where one exists (a double lease accepted, two issues numbered 2 on two branches, verify clean on a conflicted file, a stale lease not shown at 30 minutes) and green after; a clock seam read by the stamp and by the views' now exists for tests only; a live run with real agents is kept in research/2026-11-03-jarl-as-a-loop-tool

## Evidence

Ruling ask-010 (stuck): Krzysztof, 2026-11-03 (translated from Polish): "yes", after the question was put to him again in plain words (a sixth exam for one agent working alone, with no coordinators: Jarl asks for no extra setup and says plainly when the owner must start a fresh session to review). Option (1) (option label, not his wording). The full ruling is sixth-scenario-one-agent-alone.

Ruling sixth-scenario-one-agent-alone: Krzysztof, 2026-11-03 (translated from Polish): "yes", to adding a sixth scenario to the five of ruling loop-tool-one-model-five-scenarios: one agent alone runs a loop from init to close with init, new, next, evidence, review, set done, ask and decide, no goal line beyond the goal, and when a review is needed Jarl says plainly that the owner must start a fresh session to review the named issues.

