# 177 · Jarl: five small gaps in the review units and the closed-gate wording found by the review of group D3

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-007-opus-d3
**Where:** lib/ball.mjs issueRows and reviewUnits; lib/evidence.mjs closed-gate wording; the needFormat refusal for --bot in a composer's loop
**Branch:** jarl/173-views-and-refusals
**Merged:** 0e17fb92e93c4507d564e47f6ebb71403b6a3391 in ../../../JarlSkill
**CI:** none

## What
(1) Issues approved by a coordinator only, or not cleared under clears, keep one row each and are not grouped into review units. (2) reviewUnits groups by branch name alone, so two repositories with the same branch name are offered as one unit. (3) The closed-gate wording says holds no fresh approve even when the cause is a bot or clears. (4) The refusal for --bot in a composer's loop ends with --bot followed by a placeholder, a flag that takes no value. (5) review --by owner --bot records a bot verdict that still clears a code issue under the default gate, because the owner is recognised by name alone.

## Why
The units, the gate wording and the refusal should say what is true.

## Acceptance
Each of the five is decided and fixed or recorded as a known limitation, with a test per fix

## Evidence

- **ran:** cd skills/jarl/scripts && node --test tests/review-units.test.mjs tests/bot-reviews.test.mjs with the new tests, on the release branch tip a981c80 · **saw:** 4 new tests fail: no review row holds the coordinator-only approves of 1, 2, 3 and 7 as units (TypeError reading ids); one branch name in two repositories is one unit [1, 2, 3, 4] where two are expected; the closed gate says '(the live one is by jarl, coordinator)' and names no bot; the composer's --bot refusal ends with --bot "<as-the-view-shows>". The owner-name case of point 5 no longer reproduces: the existing test 'a bot's verdict given under the owner's name is a bot's' passes on a981c80 (tests 1, pass 1)
- **ran:** cd skills/jarl/scripts && node --test tests/review-units.test.mjs tests/bot-reviews.test.mjs at the tip · **saw:** tests 18, pass 18, fail 0: coordinator-only and not-cleared approves are one row cut into units (1, 2, 3 (one branch, jarl/a) · 7); jarl/x in hub and jarl/x in tool are two units; the closed gate names the cause and every standing approve; the composer's --bot refusal ends with jarl.mjs profile and the call's form ending in --bot. the full suite at the branch tip ac6f9bd (cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs) printed tests 1546, pass 1524, fail 0, skipped 22; every view (status, resume, next, next --as jarl and owner, report, models, branches, verify, list, decisions, profile, show, brief, text and --json) on a copy of the loop with the tool repositories linked is the same at a981c80 and at the tip except the ages, and closedGate holds only 028 in both
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on five files (import lines of ball, evidence and models, two reference tables), resolved by keeping both sides, holderKey exported from loop.mjs, and a follow-up commit dropped the unused leaseOfMove import the modules test refused · **saw:** first run tests 1583, pass 1560, fail 1 (the imports-only-names-it-uses test); after the follow-up tests 1583, pass 1561, fail 0, skipped 22, tip 0e17fb9

