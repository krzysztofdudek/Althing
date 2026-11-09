# 329 · Jarl: one window for the done gate: the evidence anchor and the approve cut reset on the same events

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261018T2029-yowo
**Tags:** jarl, invariants
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/scripts/tests/gate-window.test.mjs
**Repo:** ../../../JarlSkill
**After:** 328
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs:2444-2446 (gateState: a move out of a closes-record status sets cut and leaves anchor); SKILL.md, the set row (the evidence window resets on a reopen) and the review row (a reopen is any move out of done); probe: set 2 done, set 2 deferred, set 2 done is refused for the approve, and after a new approve it passes on the evidence row recorded before the reopen
**Branch:** jarl/328-invariants
**Merged:** 0afdb65b4c7f60c4e6e3312036aa9f58e7942379 in ../../../JarlSkill
**CI:** pending

## What
The done gate reads two windows that are computed apart: the anchor decides which --ran/--saw rows count and the cut decides which approves count. In gateState a move out of a status that closes the record sets the cut and leaves the anchor where it was, while SKILL.md says that a reopen is any move out of done and that the evidence window resets on a reopen. Probe: issue 2 done, then deferred, then done again is refused for the approve; after a new approve it passes on the evidence row recorded before the reopen. The change: one window, computed in one function that the row check and the approve check both read. A start (a move into in-progress), a reopen (any move out of a status that closes the record) and the filing of an issue never in progress reset both the anchor and the cut; a round resets the cut alone, because a red round spends the approve while the rows the worker logged stay true. SKILL.md states the window once, beside the done gate, and every other mention links there. Gate outcomes change: an issue that is reopened and closed again needs a --ran/--saw row recorded after the reopen as well as a new approve, so a close that rests on a row from before the reopen is refused. A gate that refuses a move on the base keeps refusing it.

## Why
Two windows for one rule let a reopened issue close on proof about the work from before the reopen, which is what the window exists to prevent, and the skill describes a rule the code does not run. One window stated once is one rule a reader can hold and a test can pin.

## Acceptance
- A test on a scratch loop reproduces the probe: set 2 done, set 2 deferred, a new approve, set 2 done with no new row is refused, and the refusal names the missing row after the reopen; the test fails on the base
- One test per event (start, a reopen from each closing status, filing, a round) asserts which rows and which approves count after it: a round leaves the rows counting and spends the approve; every other event resets both
- The window is computed in one function of jarl-lib.mjs that both checks call, and a test calls that function directly
- Real-loop tests: the gate is replayed over a frozen copy of a real loop (JARL_LIVE_LOOP) and over the loops the suite holds; every issue whose verdict differs from the base is listed in a row, each one is a close resting on a row from before a reopen, and no move the base refuses is accepted
- SKILL.md defines the window once and the set and review rows link to it; grep -c "since the last start or reopen" skills/jarl/SKILL.md prints at most 1, recorded as a row
- cd skills/jarl/scripts && npm test is green, and every existing assertion that changes is listed with the gate outcome it records, recorded as a row
- The issue carries a Changed changelog entry written for people who use Jarl that names the gate outcome that changes

## Changelog
- Changed: an issue that is reopened and closed again needs a --ran/--saw row recorded after the reopen, as well as a new approve. A close that rests on a row from before the reopen is refused. A start or a reopen resets both; a red round spends only the approve.

## Evidence

- **ran (history):** node --test tests/gate-window.test.mjs, on the base and on the change · **saw:** base: 3 of 5 fail (the probe, the reopen from done, gateWindow); change: 5 of 5 pass
- **ran (history):** gate replayed over a frozen copy of the 6.2.0 loop (JARL_LIVE_LOOP=copy) · **saw:** rows differing: 0; no close of the record rests on a row from before a reopen, no move the base refuses is accepted
- **ran (history):** grep -c 'since the last start or reopen' skills/jarl/SKILL.md · **saw:** 0
- **ran (history):** cd skills/jarl/scripts && npm test · **saw:** 422 tests, 0 fail; no existing assertion changed
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 0afdb65 · **saw:** 436 tests, 418 pass, 0 fail, 18 skipped

