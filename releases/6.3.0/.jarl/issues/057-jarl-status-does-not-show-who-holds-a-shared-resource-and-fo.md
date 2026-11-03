# 057 · Jarl: status does not show who holds a shared resource and for how long

**Status:** dropped
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-872e4b1a
**Where:** JarlSkill/skills/jarl/scripts/lib/rounds.mjs (leaseProblems), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:4794 at a1132a8
**After:** 035

## What
Claim: Half of the watchdog checks asked by hand who held the shared container. Corrected by the sceptic: Correct where to jarl-lib.mjs:2922-2939 (next), not 4794.

field <id> Resources declares exclusive resources and next never offers two issues holding one; there is no holder age. Map row fr-23.

## Why


## Acceptance
Proposed by the finding — make it checkable before a worker starts: status shows each held resource with its issue and the age of that issue's last row.

## Evidence

Dropped: folded into 042 (a held resource shows its holder and the age), report section 11

