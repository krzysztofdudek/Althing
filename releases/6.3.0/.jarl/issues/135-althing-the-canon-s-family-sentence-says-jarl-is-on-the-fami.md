# 135 · Althing: the canon's family sentence says Jarl is on the family number from 6.1.0 while Jarl's tests forbid a version token in the README, so the README and the canon drift

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** needs-owner, canon
**Files:** 
**Repo:** ../..
**Found by:** rev-jarl-134-opus
**Where:** Review of 134 (rev-jarl-134-opus), Outside the issue; ws check canon-sync

## What
family/canon.md line 12 keeps 'Jarl on it from 6.1.0'; Jarl's present-tense and version-token tests (rule 7) refuse that token in the README. With the README fixed, ws check canon-sync reports Jarl drift at the tip of main, and the release branch uses commas where main and the canon use em dashes. The wording of the canon is the owner's call.

## Why
Two rules disagree about one sentence that three surfaces quote; the canon is the one home of the wording.

## Acceptance
The owner rules which wording stands (the canon without the version token, or a recorded exception in the tests); the canon, the README of JarlSkill and the canon-sync check agree afterwards

## Evidence

- **ran:** node workspace/ws.mjs check canon-sync after the canon block lost 'Jarl on it from 6.1.0' (ruling canon-names-jarl-without-a-version-number) · **saw:** no drift for Jarl; the family section of Jarl's README on the release branch equals the canon block (issue 181 of the Jarl loop, merge d65727c); the five other READMEs drift and are issue 193

