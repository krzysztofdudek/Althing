# 194 · Jarl: the lease answer joins its notes with a semicolon after the spelling note's own full stop, and the offer has no subject when another lease note comes first; the path-note reader and its remembering lines

**Status:** in-progress
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-045-opus-h2c
**Where:** skills/jarl/scripts/lib/commands.mjs cmdSet leaseNotes
**Branch:** jarl/194-small-views-and-refusals
**Worker:** w-jarl-194-opus
**Worktree:** /home/me/Worktrees/JarlSkill/194-small-views-and-refusals
**Since:** 2026-11-08 14:42

## What
The lease answer joins its notes with a semicolon after the spelling note's own full stop, which prints .; and when another lease note comes first (another spelling of a model, or a checked --worktree) the offer reads without its subject.

## Why
A note should read as a sentence.

## Acceptance
The notes are joined as separate lines or sentences, each with its subject, and a test holds the case where the spelling note comes first

## Evidence

- **ran:** node --test --test-name-pattern='each a line of their own' tests/models.test.mjs (skills/jarl/scripts, release branch code at b3104b1 with the new test) · **saw:** 1 fail: one note line 'note: 002 claude-opus-5.5 is another spelling of claude-opus-5-5, which the record holds; models counts both as one model.; is leased with a model and the goal declares no Model line', the offer after '.;' with no subject
- **ran:** node --test tests/models.test.mjs tests/model-offer.test.mjs (skills/jarl/scripts at 8b2a7d3) · **saw:** 77 pass, 0 fail, 1 skipped (the live-loop case); the spelling note and the offer are two lines, each 'note: 002 …', the checked --worktree note and the offer two lines, no '.;'
- **ran:** every read view (resume, status, next, next --all, next --as jarl and owner, list, list --all, decisions, decisions --live, report, sources, branches, models, profile, verify, goal, status and resume --as jarl, and show, show --full, brief and brief --role reviewer of each of the 205 issues), text and --json, base b3104b1 against tip 59132f7 on a copy of the 6.3.0 loop with its repositories linked · **saw:** 1680 calls, 1676 identical; the 4 others (resume, status and both --as jarl, in --json) differ only in ageMs; closedGate holds only 028
- **ran:** nice -n 15 timeout 1800 node tests/suite.mjs (skills/jarl/scripts at 59132f7), then node --test tests/skill-shape.test.mjs at f89afb5 · **saw:** suite: 1654 tests, 1629 pass, 3 fail, the rest skipped; the 3 failures were skill-shape's word-of-history check on one word of the new references/commands.md text, fixed in f89afb5; skill-shape then 21 pass, 0 fail

