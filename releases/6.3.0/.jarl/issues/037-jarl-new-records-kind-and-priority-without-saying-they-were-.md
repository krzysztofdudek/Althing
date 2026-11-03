# 037 · Jarl: new records kind and priority without saying they were defaulted

**Status:** open
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-1c239812
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdNew), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:1548 at a1132a8

## What
Claim: A task filed without --kind is recorded as kind bug with no note, while the tier default gets one; the report filed a film as a bug and saw it days later in models.

new "Film of the whole epic for the tester and the PO" on a copy of the 6.2.0 loop printed 'parsed: priority 2 · tier standard · kind bug' and a note for tier only. Map row fr-01.

## Why


## Acceptance
- new without --kind prints a note that the kind was defaulted and names --kind, and the same for --prio, on the command line and through the tools
- A test files an issue with neither flag and reads both notes, and one with both flags and reads neither; red on 71ebc5b

## Evidence

