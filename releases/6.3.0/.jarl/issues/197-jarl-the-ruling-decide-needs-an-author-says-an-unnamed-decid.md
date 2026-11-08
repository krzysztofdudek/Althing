# 197 · Jarl: the ruling decide-needs-an-author says an unnamed decide can no longer occur but the library still records the coordinator, and a comment in jarl.mjs describes the old refusal style

**Status:** in-progress
**Kind:** docs
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-122-opus-j2
**Where:** lib/questions.mjs near line 328; jarl.mjs near line 1478; tests/owner-quote.test.mjs a case label; the cmdDecide comment showing [--by who]
**Branch:** jarl/194-small-views-and-refusals
**Worker:** w-jarl-194-opus
**Worktree:** /home/me/Worktrees/JarlSkill/194-small-views-and-refusals
**Since:** 2026-11-08 14:42

## What
The command line refuses decide without --by, but the library still records the coordinator for a call that names nobody, which the ruling decide-needs-an-author does not mention. A comment in jarl.mjs says answer and decide are refused with the call that names one where they end with a form; the cmdDecide comment shows --by as optional, which is true only for the library; one test case is labelled decide with no author.

## Why
Comments and labels should say whether a case is the command line's or the library's.

## Acceptance
The comments and the test label say command line or library where the case differs, the comment about the refusal style is true, and the superseding note of the ruling's scope is recorded in the loop

## Evidence

- **ran:** git show 1d02b99 --stat; node --test tests/owner-quote.test.mjs tests/surface.test.mjs tests/library-parity.test.mjs tests/tense.test.mjs (at 1d02b99) · **saw:** comments and labels only, no behaviour changed: the cmdDecide comment shows --by <who> as the command line requires it and says the library alone records the coordinator for a call that names nobody; the jarl.mjs comment says the refusal ends with the form, --by a placeholder; the case is 'decide through the library with no author'; the surface test title says 'ending with the form'; 62 pass, 0 fail
- **ran:** every read view (resume, status, next, next --all, next --as jarl and owner, list, list --all, decisions, decisions --live, report, sources, branches, models, profile, verify, goal, status and resume --as jarl, and show, show --full, brief and brief --role reviewer of each of the 205 issues), text and --json, base b3104b1 against tip 59132f7 on a copy of the 6.3.0 loop with its repositories linked · **saw:** 1680 calls, 1676 identical; the 4 others (resume, status and both --as jarl, in --json) differ only in ageMs; closedGate holds only 028

Ruling decide-needs-an-author-is-the-command-lines-rule: Clarifies decide-needs-an-author without replacing it: the rule that a ruling always names its author holds for the command line, which refuses decide without --by. The library still records the coordinator for a call that names nobody, because a program calling it has no command line to refuse it. The comments and the test label say which of the two a case is. Issue 197 carries the wording.

