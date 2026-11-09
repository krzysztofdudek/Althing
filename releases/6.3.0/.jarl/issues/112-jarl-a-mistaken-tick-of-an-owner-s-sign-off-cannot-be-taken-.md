# 112 · Jarl: a mistaken tick of an owner's sign-off cannot be taken back

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T1908-qysq
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 039
**Found by:** rev-jarl-039-opus
**Where:** Review of 039 (2026-11-03): lib/owner-lines.mjs
**Branch:** jarl/187-writes-and-gaps
**Merged:** a981c807dab09c25e7e1444c1b09ad1ef46dfc88 in ../../../JarlSkill
**CI:** none

## What
tick records the owner's sign-off on an acceptance line. A tick given by mistake cannot be undone except by a round or a reopen, which void every tick.

## Why
Taking back one proof line, a note or a row is possible; a tick should be too.

## Acceptance
A way to take back one tick with who and why, ridden on the format raise like a retraction, with tests

## Changelog
- Added: The owner can take back a sign-off he gave by mistake on one step he checks himself, and say why. The task then waits for his sign-off on that step again, and nothing else is undone.

## Evidence

- **ran (history):** node --test tests/owner-sign-off.test.mjs (the two new tests on the code before the fix) · **saw:** pass 9 fail 2: no way to take back a tick: retract 1 tick-2 was refused as an unknown entry, and the ticked-already refusal named no way back
- **ran (history):** node --test tests/owner-sign-off.test.mjs tests/surface.test.mjs tests/docs-true.test.mjs (at 60a06f7) · **saw:** pass 11 and pass 52, fail 0: retract 1 tick-2 --by owner writes 1 tick retract · line 2 · by owner · <why> · <the line>; done waits for his tick again, the row and the approve stand, show names who took it back and why, a refusal writes nothing, log refuses the shape with the retract form, both frozen readers refuse the format-3 loop, and a loop with no owner line is not raised
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 60a06f7, the tip of jarl/187-writes-and-gaps) · **saw:** tests 1492, pass 1470, fail 0, cancelled 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 3e9a411, the branch with release/6.2.1 at 1d09fe3 merged in, one conflict in lib/log.mjs resolved by keeping both sides) · **saw:** tests 1518, pass 1496, fail 0, cancelled 0, skipped 22, exit 0
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1534, pass 1512, fail 0, skipped 22, merge a981c80

