# 044 · Jarl: external requirements are not tracked against the work

**Status:** in-progress
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-ead14454
**Where:** JarlSkill/skills/jarl/scripts/lib/import.mjs (cmdImport), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:6184 at a1132a8
**After:** 035, 078
**Branch:** jarl/044-import-changes
**Worker:** w-jarl-044-takeover-opus
**Worktree:** /Users/me/Worktrees/JarlSkill/044-import-changes
**Since:** 2026-11-05 12:26

## What
Claim: The requirements checklist against about 30 external tickets was built by hand. Corrected by the sceptic: Severity low: coverage and status per requirement already work through import and sources; the gap is re-import diffing and the owner's question of a requirement concept.

import and sources map findings to issues and their status; there is no link to evidence or rulings and no diff of a changed source. Map row fr-09.

## Why

Work driven by outside tickets needs to know which items changed upstream; the issue tree with Sources (078) holds the items, so only the change report is missing.

## Acceptance
- import reports each finding whose text changed since its issue was filed, with both texts
- No separate requirement concept: external requirements are a branch of the issue tree with a Source (078); reason in research/2026-11-03-jarl-as-a-loop-tool/report.md section 11
- Tested

## Changelog
- Importing a findings file again reports each finding whose text differs from the task filed for it, with both texts, and leaves the task as it was. Outside tickets can be followed this way: file them under one parent task and import again whenever the tickets change.

## Evidence

- **ran:** node --test tests/import-changes.test.mjs (before the change) · **saw:** tests 8, pass 0, fail 8: every test failed, the import result had no changed list
- **ran:** node --test tests/import-changes.test.mjs (after the change) · **saw:** tests 8, pass 8, fail 0
- **ran:** jarl import findings-a.json twice, then findings-b.json (one claim changed), on a copy of the 6.3.0 loop · **saw:** second run: filed 0, already filed 2, no changed line; third run: already filed 2 · changed since filed 1, issue 159 (open) What with the issue text and the finding text, and the line that import leaves the issue as it is; --json carries changed[]
- **ran:** TMPDIR=<scratch> npm test in skills/jarl/scripts at the branch tip · **saw:** tests 1234, pass 1214, fail 0, skipped 20
- **ran:** node --test tests/import-changes.test.mjs with the first commit's import.mjs and the new tests · **saw:** tests 12, pass 8, fail 4: the hand-filed, imported-beside-hand, one-word and Unicode-form tests fail
- **ran:** node --test tests/import-changes.test.mjs with the new import.mjs · **saw:** tests 12, pass 12, fail 0
- **ran:** jarl import (dry run and real) of the as-a-loop-tool findings.json and of the field report's materials/findings.json, on a fresh copy of the 6.3.0 loop · **saw:** loop-tool file: 12 findings, already filed 12, no changed line, dry run and real run; field report file: 38 findings, already filed 38, no changed line; a one-finding file with a rewritten claim for an import-filed issue: changed since filed 1, issue 037 (done)
- **ran:** TMPDIR=<scratch> npm test in skills/jarl/scripts at the branch tip · **saw:** tests 1238, pass 1218, fail 0, skipped 20
- **ran:** node --test tests/import-changes.test.mjs with the previous import.mjs and log.mjs and the new tests · **saw:** tests 16, pass 12, fail 4: the stopped run, the two files of one number, the log refusal and the lost-words tests fail
- **ran:** node --test tests/import-changes.test.mjs with the new code · **saw:** tests 16, pass 16, fail 0
- **ran:** jarl import (dry run and real) of both findings files on a fresh copy of the 6.3.0 loop, then a file with a rewritten claim · **saw:** loop-tool file: already filed 12, no changed line (dry and real); field report file: already filed 38, no changed line; rewritten claim: changed since filed 1, issue 037 (done)
- **ran:** TMPDIR=<scratch> npm test in skills/jarl/scripts at the branch tip · **saw:** tests 1242, pass 1222, fail 0, skipped 20

