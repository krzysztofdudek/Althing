# 332 · Jarl: one store of state: every view reads status, lease and verdict from the same source the done gate reads

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Key:** 20261018T2029-jmul
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/one-store.test.mjs
**Repo:** ../../../JarlSkill
**After:** 331
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (gateState replays log.md; cmdStatus, cmdReport, renderResume and the other views read the Status: header of the issue file; alignRows reconciles the two); Horde loop.mjs editTicket writes ticket files under the lock with no log line; probe: a hand edit of issue 004 from in-progress to done makes status report it done with no log line, no approve and no row
**Branch:** jarl/332-one-store
**Merged:** 3f6fbf8884c9fe89e19cca337eed4475e26b7a0d in ../../../JarlSkill
**CI:** pending

## What
SKILL.md promises that a status that changed without a log line did not change. The code keeps two stores: the views read the Status: header of the issue file, the done gate replays the journal, and alignRows exists to reconcile them. Probe: a hand edit of issue 004 from in-progress to done makes status count it done, with no log line, no approve and no row; a composer such as Horde edits ticket files directly. The change makes one of the two the source and the other its projection. The first deliverable is a design note in this issue Evidence, reviewed by a fresh reviewer before any code: it chooses between (a) every view derives status, lease and verdict from the same journal replay the gate uses, and (b) the issue file is authoritative and the log is its audit, and it justifies the choice by what each costs the views, the merge drivers, Horde and a reader of the files. Then: existing loops read and print unchanged; a status on file that disagrees with the source is reported by status and resume, never believed silently; composers write through record operations, and the record contract jarl-record/1 keeps every export and its behaviour; the record format is raised through raiseFormat only where a reader on the base would misread the record silently.

## Why
The central promise of Jarl is that the tool, not discipline, keeps the status and the journal true together. Two stores make every view and the gate able to disagree, and each later check (verify among them) only reports the symptom. One source removes the disagreement at its root.

## Acceptance
- The design note is in Evidence with the choice, the rejected option and why, and a fresh approve on the note is recorded before the first commit of code on the branch (the log shows the review line before the branch first commit)
- A test reproduces the probe: a hand edit of an issue Status: header from in-progress to done; status and resume do not count it done and print one line naming the disagreement and the command that settles it; the test fails on the base
- A test: an issue moved only through the tool reads the same in every view as on the base, over the suite loops and a frozen copy of a real loop (JARL_LIVE_LOOP), byte for byte, recorded as a row
- record-contract.test.mjs is unchanged and green, and RECORD_API is unchanged; a test drives a composer flow through record operations alone and every view agrees with the gate
- format-marker.test.mjs is green; the format is raised only by a write that a reader on the base would misread silently, proved by the frozen earlier reader refusing such a loop loudly, or the note states that no format step is needed and why
- SKILL.md states which store is the source once, in the present tense

## Changelog
- Changed: The log is now the one record of an issue's status, who works on it, its merge and its CI state; the lines in the issue file are a copy the commands write beside it. Editing one of those lines by hand no longer moves the issue, changes a count or lets it close; status, resume and show print one line for each edit, saying how to put the file back or how to make the edit a real change.

## Evidence

- **ran (history):** design note of the choice between the journal and the issue file as the source of state: research/2026-10-19-jarl-one-store-of-state/design.md · **saw:** option (a) chosen: every view derives status, lease, Merged and CI from the same fold of the journal the gate uses; a disagreeing header is reported, never believed; no format step; no change to the record contract; a seven-commit plan with a byte comparison on a frozen copy of the real loop
- **ran (history):** cd skills/jarl/scripts && npm test, with JARL_LIVE_LOOP and JARL_LIVE_GOLDEN naming a frozen copy of the release loop and the golden outputs of the release tip, at the tip of jarl/332-one-store (seven commits) · **saw:** tests 465, pass 463, fail 0, skipped 2; the 14 live-loop tests (status, resume, next, report, models, list, tips, queue, branches, text and JSON) print the golden bytes
- **ran (history):** show <id> --full for all 337 issues of the copy, and check 328 and check 331 against fixed commits, written before the first change from the release tip and after commits 1, 3, 4, 5 and 7, compared with diff -r · **saw:** diff printed nothing after each of those commits: show --full for every issue, and both check outputs, are byte for byte the golden ones
- **ran (history):** node --test tests/one-store.test.mjs on the base library of each step, then on the branch · **saw:** base: step 1 L.issueState is not a function; step 2 4 fail; step 3 4 fail; step 4 11 fail; step 5 2 fail; composer flow and the words fail; branch: tests 27, pass 27, fail 0
- **ran (history):** the three probes on a scratch copy of the loop: issue 004 Status edited from done to open and its Branch line deleted by hand; jarl log "002 evidence row · echo forged"; status and show 004, driver before and the branch after · **saw:** before: status open 31 · done 239 (the edit counted), the forged line logged; after: done 240, two record: lines naming Status and Branch with the commands that settle them, the forged line refused naming jarl.mjs evidence
- **ran (history):** JARL_LIVE_LOOP set: the fold of the journal against the header of every issue of the copy of the release loop, and recordDisagreements over it; time of status and resume on the copy · **saw:** the fold equals the header in all 7 rendered fields for every issue the journal holds, recordDisagreements is empty; status 0.09 s, resume 0.95 s, as before the change
- **ran (history):** models --json on a copy of another real loop (252 issues), the release tip and the branch tip · **saw:** units 48 at the release tip, 43 on the branch: the 5 lost units come from move lines whose free reason opens with the word worker (for example 'worker did 013, 014 in one pass', 'worker on branch fix-toolbox · branch fix-toolbox'), which the old reading took for a worker name and counted as a lease; no command wrote a worker there, so they were phantom units, not a regression; the 6.2.0 loop's models output is byte-identical
- **ran (history):** node --test tests/one-store.test.mjs: property tests over 34 nasty worker, model and branch values, and the refusals · **saw:** every accepted value reads back identical from the log and the header, every refused one writes nothing to the journal or the file; red on the previous commit (6 failures), green on the branch; full suite tests 480, pass 478, fail 0, skipped 2; show --full for 337 issues byte-identical
- **ran (history):** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 3f6fbf8 · **saw:** 483 tests, 463 pass, 0 fail, 20 skipped (live-loop tests without their variables); show --full for all 337 issues of the real loop identical to the pre-change goldens

