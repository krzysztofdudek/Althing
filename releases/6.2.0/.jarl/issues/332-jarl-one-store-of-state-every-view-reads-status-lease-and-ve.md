# 332 · Jarl: one store of state: every view reads status, lease and verdict from the same source the done gate reads

**Status:** in-progress
**Kind:** gap
**Priority:** 2
**Tier:** strong
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/one-store.test.mjs
**Repo:** ../../../JarlSkill
**After:** 331
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/jarl-lib.mjs (gateState replays log.md; cmdStatus, cmdReport, renderResume and the other views read the Status: header of the issue file; alignRows reconciles the two); Horde loop.mjs editTicket writes ticket files under the lock with no log line; probe: a hand edit of issue 004 from in-progress to done makes status report it done with no log line, no approve and no row
**Branch:** jarl/332-one-store
**Worker:** w-g-sonnet
**Since:** 2026-10-18 22:55

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

## Evidence

- **ran:** design note of the choice between the journal and the issue file as the source of state: research/2026-10-19-jarl-one-store-of-state/design.md · **saw:** option (a) chosen: every view derives status, lease, Merged and CI from the same fold of the journal the gate uses; a disagreeing header is reported, never believed; no format step; no change to the record contract; a seven-commit plan with a byte comparison on a frozen copy of the real loop

