# 148 · Jarl: set done accepts a code issue with a lease and no merge, and status then flags the same issue as closed with a gate that does not hold

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Key:** 20261105T0642-ivym
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** haiku-usability-run
**Where:** Usability run of 096 (a Haiku test subject, 16 calls, 0 refused); the transcript is in research/2026-11-03-jarl-as-a-loop-tool/usability-run-096.md
**Branch:** jarl/004-gate-and-ratify
**Merged:** 8235dafa695a100d2dca5e01937886776d0ab635 in ../../../JarlSkill
**CI:** none

## What
On a scratch loop, an issue leased with a branch (a code issue by the skill's definition) was given one proof row and one fresh approve, and set done accepted it with no merge recorded. The review reply had said the merger merges first and a worker never sets done. status then listed it as 'closed, gate does not hold: a code issue done with no merge recorded' with a repair that reopens it. The skill never says a merge is needed before done, and the help's list of what done needs has no merge in it.

## Why
A command that accepts a close and a view that calls the same close broken disagree about one rule, and an agent follows the command.

## Acceptance
Either set done on a code issue with no recorded merge is refused with the form that records the merge, or the status flag and the review reply no longer call it broken; SKILL.md and the help state which; a test holds the chosen rule, and a loop with no repository (nothing to merge) is covered

## Changelog
- Changed: A task worked on its own branch can be closed only after its merge is recorded. Before, Jarl closed it without one and then flagged it as closed wrongly. A task without a branch closes as before.

## Evidence

- **ran (history):** node --test tests/merge-before-done.test.mjs (branch with the test, before the gate change) · **saw:** pass 1, fail 2: done refuses a code issue with no merge recorded ... fails with AssertionError: expected a refusal: set 1 done all green --by jarl (done accepted it); the loop with no repository and no Branch passes
- **ran (history):** node --test tests/retract.test.mjs tests/shared-number.test.mjs tests/models.test.mjs tests/models-loops.test.mjs tests/log-reader.test.mjs tests/profile.test.mjs tests/jarl.test.mjs tests/closed-gate.test.mjs tests/fresh-review.test.mjs tests/brief.test.mjs tests/gate-window.test.mjs tests/gate-decide-tips.test.mjs tests/merge-before-done.test.mjs tests/proof-notes.test.mjs; then tests/skill-shape tense docs-true help-workflow printed-texts surface refusals-walk (after the change) · **saw:** pass 418, fail 0; then pass 81, fail 0
- **ran (history):** on two copies of the loop: evidence 148 --ran 'npm test' --saw pass, review 148 approve --by rev-fresh-demo, then set 148 done, with the release tip and with the branch · **saw:** release tip: 148 → done, exit 0; branch: 148 carries code (its lease records Branch jarl/004-gate-and-ratify) and records no merge — a code issue is merged before it is done ..., then the form jarl.mjs merged <ids> --sha <sha>, exit 1
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch with packages A, B and C, TMPDIR from mktemp -d; two import lines conflicted with B and kept the names of both sides · **saw:** tests 1369, pass 1347, fail 0, skipped 22, merge 8235daf

