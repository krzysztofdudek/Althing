# 106 · Jarl: with a takeover limit other than three, the printed takeover of older Jarls differs from the count recorded; an older round text shaped like 'takeover 1 of 1 · ' reads as a standing

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 066
**Found by:** rev-jarl-066e-opus
**Where:** Review of 066 (2026-11-03): round standing
**Branch:** jarl/082-takeover-and-brief
**Worker:** w-jarl-082-sonnet
**Worktree:** /home/me/Worktrees/JarlSkill/082-takeover-and-brief
**Since:** 2026-11-06 21:07

## What
With a limit other than three, the takeover an older Jarl prints differs from the count the new rounds record, and older round text shaped like a standing is still read as one.

## Why
A count that two Jarl versions write must agree, or a text must not pass for a standing.

## Acceptance
The two cases are fixed or stated as limits in references/record.md, with tests

## Changelog
- Changed (in the Takeover entry): Each round line now shows its place in that count, which older Jarl versions read as a plain round. An older Jarl still suggests a handover at every round from the third, whatever the goal says, and the count goes on from each suggestion it made; the words of a round it wrote are never taken for a place in the count.

## Evidence

- **ran:** cd skills/jarl/scripts && nice -n 15 node --test --test-name-pattern 'frozen reader' tests/models.test.mjs (the two new tests, on the release-branch code at b6f670c) · **saw:** tests 7, pass 5, fail 2: after a round the pinned 6.1.0 and 6.2.0 readers wrote at limit 2 the count gave [4, true, 2] where the reader had printed a takeover (expected [4, false, 1]); a frozen round whose text opens 'takeover 1 of 1 · ' was read as standing { takeover: true, count: 1, limit: 1 } (expected none)
- **ran:** cd skills/jarl/scripts && nice -n 15 node --test tests/models.test.mjs tests/log-reader.test.mjs tests/brief.test.mjs (commit 3269ebd) · **saw:** tests 96, pass 95, fail 0, skipped 1
- **ran:** copy of releases/6.3.0/.jarl with goal --set 'Takeover: 2', then round 066 'red after four rounds of the driver', with the code of b6f670c and with 3269ebd; then the pinned driver's status and round on the second copy · **saw:** b6f670c: '066 round 5 — takeover:' (line '066 round 5 · takeover 2 of 2 · …', though the driver had printed a takeover at round 4); 3269ebd: '066 round 5: 1 of 2 before a takeover' (line '066 round 5 (count 1 of 2) · …'); the driver opened the copy and numbered its next round 6
- **ran:** cd skills/jarl/scripts && TMPDIR=<a mktemp -d folder> nice -n 15 timeout 1800 node tests/suite.mjs (branch tip be25e1f) · **saw:** tests 1454, pass 1432, fail 0, skipped 22 (the run before be25e1f failed only the writer test, whose round line still had the shape before 3269ebd; be25e1f updates it)

