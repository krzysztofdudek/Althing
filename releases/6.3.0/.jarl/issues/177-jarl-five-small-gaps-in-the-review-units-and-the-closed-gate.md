# 177 · Jarl: five small gaps in the review units and the closed-gate wording found by the review of group D3

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-007-opus-d3
**Where:** lib/ball.mjs issueRows and reviewUnits; lib/evidence.mjs closed-gate wording; the needFormat refusal for --bot in a composer's loop

## What
(1) Issues approved by a coordinator only, or not cleared under clears, keep one row each and are not grouped into review units. (2) reviewUnits groups by branch name alone, so two repositories with the same branch name are offered as one unit. (3) The closed-gate wording says holds no fresh approve even when the cause is a bot or clears. (4) The refusal for --bot in a composer's loop ends with --bot followed by a placeholder, a flag that takes no value. (5) review --by owner --bot records a bot verdict that still clears a code issue under the default gate, because the owner is recognised by name alone.

## Why
The units, the gate wording and the refusal should say what is true.

## Acceptance
Each of the five is decided and fixed or recorded as a known limitation, with a test per fix

## Evidence

