# 059 · Jarl: visual review has no kind and no verdict per artifact

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-467627b4
**Where:** JarlSkill/skills/jarl/scripts/lib/review.mjs (cmdReview), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4439 at a1132a8
**After:** 035, 083

## What
Claim: The most valuable finds were visual, and the rule that every render gets a visual reviewer could not be enforced. Corrected by the sceptic: Correct the evidence: a profile kind with required render slots already gates done; the owner's question narrows to a verdict per artifact and a gate at merged.

No review kind exists; attachments exist only for profile slots and not on verdicts. Map row fr-25.

## Why


## Acceptance
- review takes --artifact <path> naming the render or file a verdict judged, written under format 3 (083); report counts verdicts that name an artifact
- No gate at merge: Jarl never blocks landing; the owner's own looks are owner-only lines (039)
- Tests

## Evidence

