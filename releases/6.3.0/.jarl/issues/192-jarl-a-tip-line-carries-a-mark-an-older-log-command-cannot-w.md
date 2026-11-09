# 192 · Jarl: a tip line carries a mark an older log command cannot write, so an older Jarl's line never counts as a row's tip

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Key:** 20261108T0948-ycsk
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** owner
**Where:** skills/jarl/scripts/lib/log.mjs and lib/loop.mjs: the tip line; follows issue 033
**Branch:** jarl/016-line-and-tip-mark
**Merged:** afee327cc41e51097d48dc06754bc23aaffbf8ce in ../../../JarlSkill
**CI:** none

## What
Issue 033 made a tip line count only as the next line after its row under the same stamp, but a tip line written by an older Jarl's log command in the same minute and directly after its row still counts as that row's tip. The owner (2026-11-08, a-018) chose to close this with a tip mark before the separator that an older log command cannot write.

## Why
A forged or accidental tip line should not keep proof alive across a pause.

## Acceptance
A tip line counts only when it carries the mark; the first write of a tip raises the loop to record format 3 and never raises a loop that records no tip; the pinned 6.1.0 driver and the installed 6.2.0 Jarl refuse such a loop with their own message; a tip line without the mark (written by an older log command) never counts, with a test that writes one through the pinned driver; the closed-issue gate of this loop's 111 done issues does not start to fail (compare views on a copy of the real loop)

## Changelog
- Added: The note of which code a test result, a review or a merge was made on carries a mark that only this Jarl writes, so a line written by an older Jarl never keeps a task's results alive across a pause. The first such note moves the loop to format 3; a loop with no branch to note stays as it is.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/gate-window.test.mjs, in a copy of the release tip's scripts with the new tests (before the change) · **saw:** tests 27, pass 22, fail 4, skipped 1: no tip line carries a mark; the first tip leaves a format-1 loop at format 1, so the frozen readers still read it; a tip line the pinned 6.1.0 log command wrote right after its row and its approve under the same stamp kept both across a pause ([1, true], expected [0, false]); a loop whose profile names an external scheduler wrote tip lines at format 1
- **ran (history):** cd skills/jarl/scripts && node --test tests/gate-window.test.mjs tests/format-marker.test.mjs tests/review-waiver.test.mjs tests/outside-findings.test.mjs tests/closed-gate.test.mjs tests/gate-decide-tips.test.mjs tests/merge-holds.test.mjs tests/log-reader.test.mjs tests/record-contract.test.mjs (branch tip 59a5b1c) · **saw:** tests 153, pass 152, fail 0, skipped 1 (the replay of a real loop, which needs JARL_LIVE_LOOP): every tip line carries the mark before the separator; the first tip raises a format-1 loop to 3 and both pinned readers (6.1.0, 6.2.0) refuse it with their own message; a loop that records no tip stays unraised; a tip line the pinned driver's log command writes right after its row and its approve keeps nothing across a pause, and verify names it; a composer loop below 3 records no tip and lists it as off; the waiver and outside-finding setups that need a format-1 loop write their rows through the pinned reader
- **ran (history):** status, resume, report, list --all, next --all, next --as jarl and owner, verify, decisions --live, models, branches, goal, profile (each with --json where it has one), show and show --json of every issue and brief of the last 12, on a copy of the 6.3.0 loop with JarlSkill and Yggdrasil linked beside it: the scripts of release/6.2.1 against those of 59a5b1c · **saw:** 443 views compared, 0 differ once ages are taken out; closedGate lists only 028 on both; the copy stays at record format 1 and no profile.json is written
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at 59a5b1c, the tip of jarl/016-line-and-tip-mark, TMPDIR from mktemp -d) · **saw:** tests 1583, pass 1561, fail 0, cancelled 0, skipped 22, exit 0; an earlier run at fdb1762 hit ENOSPC under load in three files that pass alone, and found the commands reference without --line among the evidence flag fields, added in 59a5b1c
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d; the merge conflicted on an import line of lib/evidence.mjs and two places of lib/review.mjs, resolved by keeping both sides · **saw:** tests 1595, pass 1573, fail 0, skipped 22, merge afee327

