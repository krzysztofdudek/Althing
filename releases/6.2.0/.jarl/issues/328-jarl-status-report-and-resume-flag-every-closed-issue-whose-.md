# 328 · Jarl: status, report and resume flag every closed issue whose done gate does not hold on the record as it stands

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, invariants
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/closed-gate.test.mjs
**Repo:** ../../../JarlSkill
**After:** 325
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (doneRefusal, gateState, reviewSplit, checkSummary, cmdStatus, cmdReport, renderResume); probe: review 1 approve --by jarl, evidence 1 --ran ... --saw ..., set 1 done, merged 1 --sha <sha>, review 1 retract, evidence 1 --retract 1 leaves 1 done; set 3 dropped then merged 3 --sha ... --ran ... --saw ... is accepted; set 2 done on a code issue with no merge is accepted
**Branch:** jarl/328-invariants
**Merged:** 0afdb65b4c7f60c4e6e3312036aa9f58e7942379 in ../../../JarlSkill
**CI:** pending

## What
Jarl checks the done gate only at the move into done, so the command line alone can drive the record into states the gate would refuse to enter, and the views show them as ordinary done work. A done code issue whose approve was retracted with review retract, or whose proof row was retracted with evidence --retract, stays done. merged records a merge on an issue that is already done (the issue then carries code with no fresh approve, and only a stderr note says so) and on a dropped issue, and report counts that merge in "2 of 2 merge(s) carry a passing check row". set done on a code issue with no merge and its branch gone is accepted without a word. report counts a retracted approve as unrecorded, the bucket documented as approves recorded without --by. The change: one read-only derivation, replayed from the same journal the gate reads, that lists every issue in a closing status whose gate does not hold now, each with its reason: the approve retracted or spent, the proof row retracted, no fresh approve on an issue that carries code, a merge recorded after the issue went done, a merge on a dropped or deferred issue, a code issue done with no merge. status, report and resume print each such issue as one line: the id, the reason and the command that repairs it (a fresh review, a new --ran/--saw row, set open to reopen, or a note through evidence). report names a retracted approve retracted. No move gains a refusal, no file or field is added, and the record is unchanged.

## Why
Jarl records, derives and displays; a view that shows a done issue as settled while its gate fails on the record displays a state the record does not support. Flagging it in the views keeps the boundary that Jarl never blocks code from landing and adds no store, and the owner and the coordinator see every such issue at boot instead of meeting it in a release.

## Acceptance
- A test drives a scratch loop through the probe (review 1 approve --by jarl, evidence 1 --ran ... --saw ..., set 1 done, merged 1 --sha <sha>, review 1 retract, evidence 1 --retract 1): status, report and resume each print one line for issue 1 naming the retracted approve and the retracted row with a repairing command; the test fails on the base
- A test: set 3 dropped, then merged 3 --sha ... --ran ... --saw ...: the views flag 3 as a merge on a dropped issue, and report does not count that merge among the merges carrying a passing check row; the test fails on the base
- A test: set 2 done on an issue with a Branch and no Merged field: the views flag 2 as a code issue done with no merge; the test fails on the base
- A test: merged on an issue that went done with only a coordinator approve: the views flag it as carrying code with no fresh approve; the test fails on the base
- status --json, report --json and resume --json carry the flagged issues as one array of {id, reason, repair}; a loop with none prints no such line and the array is empty, tested
- report names a retracted approve retracted and never counts it as unrecorded, tested
- No refusal changes and the record does not change: cd skills/jarl/scripts && npm test is green with no existing assertion changed, and format-marker.test.mjs is green, recorded as rows
- SKILL.md states the flag once, beside the done gate, in the present tense

## Changelog
- Added: status, report and resume list every closed issue whose done gate does not hold on the record (a retracted approve or proof, a merge after done or on a dropped issue, a code issue done with no merge), one line each with the command that repairs it. report says retracted for a retracted approve.

## Evidence

- **ran:** node --test tests/closed-gate.test.mjs, on the base and on the change · **saw:** base: 6 of 7 tests fail; change: 7 of 7 pass
- **ran:** status on a frozen copy of the 6.2.0 loop (236 done, 336 issues) · **saw:** no closed issue flagged: every done gate holds on the real record; report --json carries closedGate []
- **ran:** cd skills/jarl/scripts && npm test, format-marker.test.mjs included · **saw:** 416 tests, 0 fail; one key list in profile.test.mjs extended with closedGate (report --json keys)
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 0afdb65 · **saw:** 436 tests, 418 pass, 0 fail, 18 skipped

