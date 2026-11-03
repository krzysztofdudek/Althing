# 041 · Jarl: relayed verdicts count as fresh reviews in report and status

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-a1ab3b3a
**Where:** JarlSkill/skills/jarl/scripts/lib/metrics.mjs (metricsOf), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4002 at a1132a8
**After:** 035

## What
Claim: 65 of 136 verdicts came from a pull-request bot and were counted among fresh reviewers. Corrected by the sceptic: Kind gap and owner, not defect: count relayed apart in report and status; whether a bot's approve may clear an issue is the owner's call.

--relayed exists and models counts it per reviewer, but the fresh, coordinator and self split of report and status ignores it, so a relayed approve counts as fresh and clears the gate. Map row fr-06.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: Count relayed verdicts apart in report and status; the owner rules whether a bot's approve may clear an issue.

## Evidence

