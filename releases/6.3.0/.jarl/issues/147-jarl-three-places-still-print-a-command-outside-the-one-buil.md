# 147 · Jarl: three places still print a command outside the one builder: the merged line of status and report, the held-lease placeholder, and the slice rule text

**Status:** open
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096k-opus
**Where:** Review of 096 (rev-jarl-096k-opus), Outside the issue; related to issue 141

## What
(1) The prose of status and report prints 'merged <ids> --sha <sha> --ran "<command>" ...' with no jarl.mjs, without the call's --root and with unquoted placeholders, against the CHANGELOG's line that every printed command carries the call's --root. (2) The held-lease refusal of set ends with a positional "<--handover-or-none>" placeholder that is odd once filled. (3) The rule text shown by next --as jarl, which comes from references/jarl.md, shows '--slice <name>' with an unquoted placeholder. Found by the final review of 096, outside its five grounds.

## Why
The claim that every printed command goes through one builder and carries --root should hold, or the CHANGELOG line should say what it covers.

## Acceptance
Each of the three prints through the builder (or is rewritten as prose without a command line), carries the call's --root, and the source test that guards the builder covers it

## Evidence

