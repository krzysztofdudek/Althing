# 070 · Jarl: no single digest of what waits on the owner

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0838-bzcl
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-0281cd92
**Where:** JarlSkill/skills/jarl/scripts/lib/questions.mjs (cmdAsk), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5540 at a1132a8
**After:** 035

## What
Claim: The owner reads in bursts; one message with every open question and sign-off would match that.

resume lists questions and ratify items in two blocks; no digest. Map row fr-38.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: ask --digest prints open questions, ratify items and owner sign-offs in one message.

## Evidence

Dropped: folded into 052 (next --as owner --all is the owner's digest), report section 11

