# 043 · Jarl: nothing flags a ruling that no merged issue implements

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-0a2a9cba
**Where:** JarlSkill/skills/jarl/scripts/lib/questions.mjs (cmdDecide), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:5763 at a1132a8

## What
Claim: Two rulings were never implemented and nobody noticed until an audit. Corrected by the sceptic: Correct where to jarl-lib.mjs:1193 and 6360; the proposal narrows to verify (and resume) listing rulings whose Settles issues are not all done.

decide --settles writes a ruling into issues' evidence; verify lists only open issues that cite a superseded ruling. Map row fr-08.

## Why


## Acceptance
- verify lists each ruling in force whose Settles names an issue that is neither done nor dropped, with the ruling's slug and those ids
- A test with one such ruling and one fully settled ruling; red on 71ebc5b

## Evidence

