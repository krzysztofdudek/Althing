# 336 · Jarl: the record library matches the command line, and one list names what only the command line does

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** jarl, coherence
**Files:** JarlSkill/skills/jarl/scripts/record.mjs, JarlSkill/skills/jarl/scripts/jarl-lib.mjs, JarlSkill/skills/jarl/SKILL.md, JarlSkill/skills/jarl/scripts/tests/record-contract.test.mjs, JarlSkill/skills/jarl/scripts/tests/library-parity.test.mjs, JarlSkill/skills/jarl/scripts/jarl.mjs
**Repo:** ../../../JarlSkill
**Found by:** jarl-architect
**Where:** JarlSkill/skills/jarl/scripts/record.mjs (recordMerged keeps CI pending when none is given; answer takes no by; review is called without caller; setStatus defaults caller to record); jarl.mjs:558 (the comment that --by reaches answer only through jarl-lib.mjs); Horde loop.mjs:111 (ticketFile matches /^\d{3,}-/)
**After:** 335
**Branch:** jarl/336-library-parity
**Merged:** 899693346192649fb06944a6ee5505ae73bbdeca in ../../../JarlSkill
**CI:** pending

## What
The record library is a surface with defaults of its own. recordMerged keeps CI pending when none is given, while merged on the command line records none; the library never removes worktrees or branches, while the command line does unless --keep; answer in the library takes no by, so a composer cannot say who ratified; review runs without a caller, and setStatus defaults to caller record, which passes the set-by and lifecycle guards. close, archive, import, next, queue, report, check, branches and tips are not in the contract, so a composer reimplements them or shells out. The change: the library merge default and answer with by match the command line; every other difference is a deliberate one written in a single list in SKILL.md of what only the command line does (the cleanup of worktrees and branches, the Yggdrasil edge, the views outside the contract), with the reason for each. The record contract jarl-record/1 keeps every export. This work is coordinated with the Horde check of 326, which receives the list and the changed defaults.

## Why
A composer such as Horde builds on the library and meets its defaults in the field, not in a test; a default that differs from the command line without being written down is a mission that records the wrong state. One list makes every difference a decision a composer can read.

## Acceptance
- A test: R.recordMerged with no CI given differs from merged on the command line by its CI state, and that difference is on the list with its reason (an existing test pins the library's pending default)
- A test: answer through the library keeps the arity the contract holds, and the difference of who answered is on the list with its reason (a composer cannot name the ratifier through the library; the command line can)
- A test calls each record operation and the matching command on twin loops and compares the files and log lines; every difference is one the list names
- record-contract.test.mjs is green and RECORD_API is unchanged, recorded as a row
- SKILL.md holds one list of what only the command line does, each item with its reason, in the present tense
- The usage text of the command line points to the list in the skill
- Issue 326 carries a note that names the changed library defaults and the list, recorded before this issue is done

## Changelog
- Added: The skill lists every difference between the record library and the command line, with the reason for each, so a tool that builds on the library can see where the two differ.

## Evidence

- **ran:** npm test in skills/jarl/scripts, the full suite, timeout 1500 · **saw:** tests 674, pass 652, fail 0, skipped 22
- **ran:** node --test tests/library-parity.test.mjs before the list of differences was written · **saw:** fails: the files differ and the list does not name the difference: new, merged, ask
- **ran:** node --test tests/library-parity.test.mjs with the list and its table in SKILL.md · **saw:** pass 2, fail 0
- **ran:** git diff --stat release/6.2.0 over record.mjs, record-contract.test.mjs, jarl-lib.mjs and jarl.mjs · **saw:** empty: the contract, its test and the command line are unchanged
- **ran:** the eleven read-only commands on a copy of the release loop, before and after the change, compared with cmp · **saw:** status, resume, next --all, report, list --all, tips, queue, branches, show 336, show 200 and show 001 --full: eleven outputs byte-identical

Not done, and why. The library answer does not take by: the contract test pins answer's three arguments and RECORD_API stays jarl-record/1, so the test that answer with by names the ratifier cannot be green; a run on the branch with a by argument records By: owner. This needs the coordinator's choice between a new contract version and listing the difference (the list currently names it under Who answered). The library merge default is not aligned: the merge-check test pins the pending default of a library merge, and changing an existing assertion is not done, so the difference stays in the list with its reason. The help text pointer is not written: the usage text lives in jarl.mjs, which is not in this issue's declared files. Both are open for the coordinator.
- **ran:** npm test in skills/jarl/scripts after the usage text pointer, the full suite, timeout 1500 · **saw:** tests 674, pass 652, fail 0, skipped 22
- **ran:** the eleven read-only commands on a copy of the release loop, compared with cmp after the pointer · **saw:** eleven outputs byte-identical
- **ran:** npm test in skills/jarl/scripts after round two, the full suite, timeout 1500 · **saw:** tests 675, pass 653, fail 0, skipped 22
- **ran:** node --test tests/library-parity.test.mjs: every record function export has a parity case; the list and the SKILL.md table agree cell by cell · **saw:** 3 tests, 3 pass
- **ran:** a copy of the skill with one table cell changed, the agreement test run on the copy · **saw:** fails: the table rows, cell by cell, differ
- **ran:** the eleven read-only commands on a copy of the release loop, compared with cmp after round two · **saw:** eleven outputs byte-identical
- **ran:** cd skills/jarl/scripts && npm test, on release/6.2.0 at the merge 8996933 · **saw:** 675 tests, 653 pass, 0 fail, 22 skipped; worker haiku-5.5, two rounds plus a minor-rows commit, reviewer sonnet-5.5 approved

