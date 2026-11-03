# 037 · Jarl: new records kind and priority without saying they were defaulted

**Status:** in-progress
**Kind:** bug
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-1c239812
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdNew), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:1548 at a1132a8
**Branch:** jarl/037-notes-and-defaults
**Worker:** w-jarl-037-haiku
**Worktree:** /home/krzysiek/.jarl-wt/JarlSkill-037
**Since:** 2026-11-03 10:58

## What
Claim: A task filed without --kind is recorded as kind bug with no note, while the tier default gets one; the report filed a film as a bug and saw it days later in models.

new "Film of the whole epic for the tester and the PO" on a copy of the 6.2.0 loop printed 'parsed: priority 2 · tier standard · kind bug' and a note for tier only. Map row fr-01.

## Why


## Acceptance
- new without --kind prints a note that the kind was defaulted and names --kind, and the same for --prio, on the command line and through the tools
- A test files an issue with neither flag and reads both notes, and one with both flags and reads neither; red on 71ebc5b

## Changelog
- Changed: When a new issue is filed without a kind or a priority, Jarl says which one it took and names the option that sets it, as it already does for the tier.

## Evidence

- **ran:** node --test --test-name-pattern="without --kind or --prio" tests/models.test.mjs (red, before the change) · **saw:** tests 1 · fail 1: AssertionError, /no --kind given, so kind bug was recorded/ did not match the input ''
- **ran:** node --test --test-name-pattern="without --kind or --prio|without --tier" tests/models.test.mjs (green, after the change) · **saw:** tests 2 · pass 2 · fail 0: 'new without --kind or --prio says on the command line that each was defaulted and names the flag; with both, neither' passed

