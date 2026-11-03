# 045 · Jarl: init does not ask for the Model lines

**Status:** open
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-c41d3623
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdInit), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:1367 at a1132a8
**After:** 035, 052

## What
Claim: The goal had no Model (<tier>) lines, so models could rank nothing.

init notes a missing Check line but not missing Model lines; models on the loop copy said the loop declares no Model lines. Map row fr-10.

## Why


## Acceptance
- init asks nothing new; when the first agent is leased in a loop with no Model lines, next --as jarl offers once the lines per tier, naming the jarl's tier (strong) and the coordinators' (standard)
- Tested

## Evidence

