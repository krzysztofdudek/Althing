# 147 · Grain: a move made with mv in Bash to follow a placement suggestion is never seen, and the suggestion expires as 'deviated'

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** strong
**Key:** 20261002T0955-llef
**Tags:** grain, hooks, 6.2
**Files:** plugins/grain/engine/grain-session.mjs, plugins/grain/engine/grain-context.mjs, plugins/grain/tests/placement-moved-by-shell.test.mjs
**Repo:** ../../../Grain
**After:** 121
**Found by:** grain-057
**Where:**
**Branch:** jarl/228-hooks-refresh
**Merged:** b1ddc48b07bbe517cab59fb2f6032050feea7ea0 in ../../../Grain
**CI:** pending

## What
After 121 a suggestion is 'followed' when the next Write lands in the suggested directory. An agent that moves a file with mv in Bash does not call Write, so the suggestion expires as 'deviated'. The worker proposes checking the disk on expiry (the misplaced file is gone and a file with that name is in the suggested directory → followed).

## Why
It understates how effective the suggestions are; this is an extension of behaviour, not a defect fix (patch-scope), so it goes to 6.2.

## Acceptance
On expiry the state of the disk is checked and a move counts as followed; a test.

## Changelog
- Fixed: a placement suggestion that the agent followed by moving the file with a shell command now counts as followed in the placement feedback.

## Evidence


- **ran (history):** node --import ./tests/git-env.mjs --test tests/placement-moved-by-shell.test.mjs (run in plugins/grain, before the fix) · **saw:** the first test fails: actual { followed: 0, deviated: 1 }, expected { followed: 1, deviated: 0 }
- **ran (history):** node --import ./tests/git-env.mjs --test tests/placement-moved-by-shell.test.mjs tests/placement-feedback.test.mjs tests/status-settles-expired-placement.test.mjs (run in plugins/grain, after the fix) · **saw:** tests 10, pass 10, fail 0
- **ran (history):** cd plugins/grain && npm test (full gate) · **saw:** tests 2353, pass 2352, fail 0, skipped 1, exit 0, merge b1ddc48

