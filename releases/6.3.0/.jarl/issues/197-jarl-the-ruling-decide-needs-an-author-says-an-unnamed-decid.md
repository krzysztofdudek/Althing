# 197 · Jarl: the ruling decide-needs-an-author says an unnamed decide can no longer occur but the library still records the coordinator, and a comment in jarl.mjs describes the old refusal style

**Status:** open
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-122-opus-j2
**Where:** lib/questions.mjs near line 328; jarl.mjs near line 1478; tests/owner-quote.test.mjs a case label; the cmdDecide comment showing [--by who]

## What
The command line refuses decide without --by, but the library still records the coordinator for a call that names nobody, which the ruling decide-needs-an-author does not mention. A comment in jarl.mjs says answer and decide are refused with the call that names one where they end with a form; the cmdDecide comment shows --by as optional, which is true only for the library; one test case is labelled decide with no author.

## Why
Comments and labels should say whether a case is the command line's or the library's.

## Acceptance
The comments and the test label say command line or library where the case differs, the comment about the refusal style is true, and the superseding note of the ruling's scope is recorded in the loop

## Evidence

