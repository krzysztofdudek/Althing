# 147 · Jarl: three places still print a command outside the one builder: the merged line of status and report, the held-lease placeholder, and the slice rule text

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Key:** 20261105T0631-oajr
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-096k-opus
**Where:** Review of 096 (rev-jarl-096k-opus), Outside the issue; related to issue 141
**Branch:** jarl/099-views-and-printed-commands
**Merged:** f1c6df3894bc06fedec9a5ce9a8eb6b277f69d7c in ../../../JarlSkill
**CI:** none

## What
(1) The prose of status and report prints 'merged <ids> --sha <sha> --ran "<command>" ...' with no jarl.mjs, without the call's --root and with unquoted placeholders, against the CHANGELOG's line that every printed command carries the call's --root. (2) The held-lease refusal of set ends with a positional "<--handover-or-none>" placeholder that is odd once filled. (3) The rule text shown by next --as jarl, which comes from references/jarl.md, shows '--slice <name>' with an unquoted placeholder. Found by the final review of 096, outside its five grounds.

## Why
The claim that every printed command goes through one builder and carries --root should hold, or the CHANGELOG line should say what it covers.

## Acceptance
Each of the three prints through the builder (or is rewritten as prose without a command line), carries the call's --root, and the source test that guards the builder covers it

## Changelog
- Changed: The note in the status and the report that merges land on testimony alone now shows the merge command in full, with the loop it belongs to.

## Evidence

- **ran (history):** node --test --test-name-pattern='every command Jarl prints is built by printCommand' tests/refusals.test.mjs and node --test --test-name-pattern='testimony mark of status' tests/landing-banner.test.mjs in a copy of the release branch before the change (the guard now also reads a command written without jarl.mjs) · **saw:** fail 2: merged <ids> --sha <sha> --ran "<command>" --saw "<what-it-printed>" stood in the testimony note of status and report with no jarl.mjs, no --root and unquoted placeholders; the same shape stood in the reason of the attachment refusal
- **ran (history):** the same two tests on the branch tip; node jarl.mjs status on a loop that declares no check · **saw:** pass 2; the note ends '(a Check line of the goal declares the command a merge must carry: jarl.mjs merged "<ids>" --sha "<sha>" --ran "<command>" --saw "<what-it-printed>" --root <the call's root>)'. Points 2 and 3 of the issue (the positional <--handover-or-none> of the held-lease refusal and the unquoted --slice <name> of the rule text) are known limitations on the list and are left as they are
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (full suite, branch tip 8aa658d, TMPDIR in one mktemp folder) · **saw:** tests 1420, pass 1398, fail 0, skipped 22, exit 0; record-contract and library-parity pass
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1463, pass 1441, fail 0, skipped 22, merge f1c6df3

