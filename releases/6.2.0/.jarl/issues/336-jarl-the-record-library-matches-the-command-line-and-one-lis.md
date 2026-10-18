# 336 · Jarl: the record library matches the command line, and one list names what only the command line does

**Status:** open
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/record-contract.test.mjs, JarlSkill/skills/jarl/scripts/tests/library-parity.test.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/record.mjs (recordMerged keeps CI pending when none is given; answer takes no by; review is called without caller; setStatus defaults caller to record); jarl.mjs:558 (the comment that --by reaches answer only through jarl-lib.mjs); Horde loop.mjs:111 (ticketFile matches /^\d{3,}-/)
**After:** 335

## What
The record library is a surface with defaults of its own. recordMerged keeps CI pending when none is given, while merged on the command line records none; the library never removes worktrees or branches, while the command line does unless --keep; answer in the library takes no by, so a composer cannot say who ratified; review runs without a caller, and setStatus defaults to caller record, which passes the set-by and lifecycle guards. close, archive, import, next, queue, report, check, branches and tips are not in the contract, so a composer reimplements them or shells out. The change: the library merge default and answer with by match the command line; every other difference is a deliberate one written in a single list in SKILL.md of what only the command line does (the cleanup of worktrees and branches, the Yggdrasil edge, the views outside the contract), with the reason for each. The record contract jarl-record/1 keeps every export. This work is coordinated with the Horde check of 326, which receives the list and the changed defaults.

## Why
A composer such as Horde builds on the library and meets its defaults in the field, not in a test; a default that differs from the command line without being written down is a mission that records the wrong state. One list makes every difference a decision a composer can read.

## Acceptance
- A test: R.recordMerged with no CI given records the same CI as merged on the command line; the test fails on the base, or the difference is in the list with its reason
- A test: answer through the library with by records that name as who answered and ratified; the test fails on the base
- A test calls each record operation and the matching command on twin loops and compares the files and log lines; every difference is one the list names
- record-contract.test.mjs is green and RECORD_API is unchanged, recorded as a row
- SKILL.md holds one list of what only the command line does, each item with its reason, in the present tense
- Issue 326 carries a note that names the changed library defaults and the list, recorded before this issue is done

## Evidence

