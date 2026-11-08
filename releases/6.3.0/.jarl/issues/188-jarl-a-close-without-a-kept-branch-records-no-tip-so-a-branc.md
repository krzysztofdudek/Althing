# 188 · Jarl: a close without a kept branch records no tip, so a branch of the same name made again later turns a paused-then-closed issue red

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-105-opus-g1
**Where:** skills/jarl/scripts/lib/loop.mjs gateOf and now()
**Branch:** jarl/187-writes-and-gaps
**Merged:** a981c807dab09c25e7e1444c1b09ad1ef46dfc88 in ../../../JarlSkill
**CI:** none

## What
In the default flow (merged without --keep deletes the branch, then set done) the close records no tip, so a closed issue's gate still reads a live branch first. If a branch of the same name is made again later, a paused-then-closed issue turns red.

## Why
A closed issue's gate must not depend on a branch that may be made again.

## Acceptance
A close in the default flow records the merge sha as its tip, and a test makes the branch again and sees the gate hold

## Changelog
- Fixed: A finished task whose branch was deleted after its merge stays finished when a branch with the same name is made again later. Before, the task could show as missing its test result and its review.

## Evidence

- **ran:** node --test --test-name-pattern 'made again later' tests/gate-window.test.mjs (before the fix) · **saw:** fail 1: with the branch made again on other work the closed issue's gate does not hold, closedGate lists 1 with no --ran/--saw row since it was moved to in-progress and its approve spent
- **ran:** node --test tests/gate-window.test.mjs tests/closed-gate.test.mjs tests/gate-decide-tips.test.mjs tests/merge-before-done.test.mjs tests/merge-cleanup.test.mjs tests/raise-keeps-paths.test.mjs (at 2c1202e) · **saw:** pass 77 fail 0: the close is followed by the tip the merge was recorded on and the closed gate holds after the branch is made again
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 60a06f7, the tip of jarl/187-writes-and-gaps) · **saw:** tests 1492, pass 1470, fail 0, cancelled 0, skipped 22, exit 0
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 3e9a411, the branch with release/6.2.1 at 1d09fe3 merged in, one conflict in lib/log.mjs resolved by keeping both sides) · **saw:** tests 1518, pass 1496, fail 0, cancelled 0, skipped 22, exit 0
- **ran:** node --test --test-name-pattern 'a close' tests/gate-window.test.mjs (the new cases of 4618ac8 on lib/loop.mjs of 0c5772a) · **saw:** pass 5 fail 4: with the owner's waiver, after a merge commit or a squash recorded once the branch was deleted, status --json closedGate lists 1 with 'it holds no approve' right after set done; with a fresh approve the close is followed by the merge's commit, not the tip the row and the approve were made on
- **ran:** node --test tests/gate-window.test.mjs tests/closed-gate.test.mjs tests/gate-decide-tips.test.mjs tests/merge-before-done.test.mjs tests/merge-cleanup.test.mjs tests/raise-keeps-paths.test.mjs (at 4618ac8) · **saw:** tests 94, pass 93, fail 0, skipped 1 (the replay of a real loop, which needs JARL_LIVE_LOOP): waiver and approve, merge commit and squash with the branch deleted, the branch kept, and the branch made again after the close all leave closedGate empty, and a close with no tip anywhere writes no tip line
- **ran:** node --test tests/identical-output.test.mjs tests/merge-holds.test.mjs tests/outside-findings.test.mjs tests/queue-model-gate.test.mjs tests/review-waiver.test.mjs tests/surface.test.mjs (at 4618ac8) · **saw:** tests 94, pass 94, fail 0
- **ran:** status, status --json and verify on a copy of the 6.3.0 loop with JarlSkill and Yggdrasil linked beside it, the scripts of release/6.2.1 against those of 4618ac8 · **saw:** status and verify identical, status --json identical but for the ageMs fields; closedGate lists only 028 (a merge is recorded on a dropped issue) on both
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 4618ac8, the tip of jarl/187-writes-and-gaps) · **saw:** tests 1534, pass 1512, fail 0, cancelled 0, skipped 22, exit 0
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1534, pass 1512, fail 0, skipped 22, merge a981c80

