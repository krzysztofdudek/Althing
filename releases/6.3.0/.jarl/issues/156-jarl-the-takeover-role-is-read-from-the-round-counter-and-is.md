# 156 · Jarl: the takeover role is read from the round counter and is wrong twice in this loop's history

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-058b-opus
**Where:** Review of 058 (rev-jarl-058b-opus), Outside the issue
**Branch:** jarl/082-takeover-and-brief
**Merged:** 1d09fe34ad818f3447059db6964f1a998f07f5eb in ../../../JarlSkill
**CI:** none

## What
takeoverStanding in lib/rounds.mjs gives issue 055 the takeover role though its three unmarked rounds ended with the same worker and no takeover move, and misses the takeover of 096, which has no round lines. In this loop no rule is scoped to the takeover role, so no brief text changes; only the roles field of brief --json is affected.

## Why
A role read by a counting heuristic can name the wrong role when a rule scoped to it exists.

## Acceptance
The takeover role comes from the recorded takeover move (a lease change to a new worker with a takeover reason), not from counting rounds, and both histories of this loop give the right role; a test holds each

## Evidence

- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/brief.test.mjs (the three new role tests, on the code of b865d19) · **saw:** tests 20, pass 17, fail 3: four unmarked rounds of one worker gave roles [takeover, worker]; a lease handed to w-two with a reason 'takeover after three rounds' and no round line gave [worker]; a round marked (takeover 1 of 1) with the same worker gave [takeover, worker]
- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/brief.test.mjs tests/scoped-rules.test.mjs tests/slices.test.mjs tests/docs-true.test.mjs tests/tense.test.mjs tests/vocabulary.test.mjs tests/words.test.mjs tests/skill-shape.test.mjs tests/models.test.mjs (commit 069569e) · **saw:** tests 185, pass 184, fail 0, skipped 1
- **ran:** copy of releases/6.3.0/.jarl: brief 055 --json and brief 096 --json, roles field, with the code of b6f670c and with 069569e · **saw:** b6f670c: 055 [takeover, worker], 096 [worker]; 069569e: 055 [worker], 096 [takeover, worker]
- **ran:** cd skills/jarl/scripts && TMPDIR=<a mktemp -d folder> nice -n 15 timeout 1800 node tests/suite.mjs (branch tip be25e1f) · **saw:** tests 1454, pass 1432, fail 0, skipped 22 (the run before be25e1f failed only the writer test, whose round line still had the shape before 3269ebd; be25e1f updates it)
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on the command map and a comment of tests/old-jarl.mjs, resolved by keeping the entries of both sides · **saw:** tests 1495, pass 1473, fail 0, skipped 22, merge 1d09fe3

