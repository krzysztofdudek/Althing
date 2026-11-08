# 199 · Jarl: three more places print multi-line text or a filled id: resume's escalation, proposed-rule and ratify sections, the lease refusal across slices, and a ruling note of several lines logged with joined lines

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** w-jarl-182-opus
**Where:** lib/resume.mjs sections for escalations, proposed rules and ratify items; lib/commands.mjs the lease refusal across slices; the log of a multi-line ruling note
**Branch:** jarl/194-small-views-and-refusals
**Worker:** w-jarl-194-opus
**Worktree:** /home/me/Worktrees/JarlSkill/194-small-views-and-refusals
**Since:** 2026-11-08 14:42

## What
(1) resume's escalation, proposed-rule and ratify sections print multi-line text on several lines. (2) The lease refusal across slices in lib/commands.mjs still ends with a filled issue id. (3) A ruling note of several lines is logged with its lines joined, so if retracted it keeps its line in resume's tail.

## Why
One row per item keeps a list scannable, a refusal's form should hold a placeholder, and a retracted note should leave the tail.

## Acceptance
The three sections print one row per item, the lease refusal ends with a form that holds a placeholder, the ruling note's joined line is matched when retracted, with a test each

## Changelog
- Fixed: The resume also shows each choice waiting for the owner's approval on one line, even one written over several lines. The text itself is kept as it was written.

## Evidence

- **ran:** node --test --test-name-pattern='a ratify item of several lines' tests/next-as.test.mjs (on b3104b1's code) · **saw:** 1 fail: '- a-1 slice:odin · the slice cannot go on' then 'because the base moved' on its own line; the rule and ratify rows alike
- **ran:** node --test --test-name-pattern='declares no Files or Resources' tests/slices.test.mjs (the form with an id placeholder, on b3104b1's code) · **saw:** 1 fail: the refusal ended with 'jarl.mjs field 1 Files "<paths>"', the issue's id filled
- **ran:** node --test --test-name-pattern='retracted ruling note of several lines' tests/retract.test.mjs (on b3104b1's code, with no change) · **saw:** 1 pass: point 3 did not reproduce: a retracted ruling note of decide and of an answer, of several lines, leaves the tail, and the live note that starts like it keeps its line (the matcher's shape with no pointer matches it); the test now holds it
- **ran:** node --test tests/retract.test.mjs tests/slices.test.mjs tests/next-as.test.mjs tests/tense.test.mjs tests/refusals.test.mjs (at 59132f7) · **saw:** 96 pass, 0 fail: each escalation, proposed rule and ratify item one row, --json keeps the text as asked; the slice refusal ends with 'jarl.mjs field "<ids>" Files "<paths>"'
- **ran:** every read view (resume, status, next, next --all, next --as jarl and owner, list, list --all, decisions, decisions --live, report, sources, branches, models, profile, verify, goal, status and resume --as jarl, and show, show --full, brief and brief --role reviewer of each of the 205 issues), text and --json, base b3104b1 against tip 59132f7 on a copy of the 6.3.0 loop with its repositories linked · **saw:** 1680 calls, 1676 identical; the 4 others (resume, status and both --as jarl, in --json) differ only in ageMs; closedGate holds only 028

