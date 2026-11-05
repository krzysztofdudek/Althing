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
- Added: Importing a findings file again, the same way as before, reports each finding whose text differs from the task the import filed for it, with both texts, and leaves the task as it was. Outside tickets can be followed this way: file them under one parent task and import again whenever the tickets change.

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
- **ran:** node --test tests/import-changes.test.mjs, the rewritten and new tests on 7919973's code (before the change) · **saw:** tests 22, pass 18, fail 4: an import run with another --found-by reports the issue, a What rewritten by hand is reported, a run stopped before its closing line gets T-5 and T-6 reported of T-1 to T-6, two merged copies with one number (key-less, written by the 6.1.0 library) report nothing for the imported 001
- **ran:** node --test tests/import-changes.test.mjs with the new code (recognition from the issue file: Source this finding alone, Found by the one the run writes, What opening with Claim: or Truth:) · **saw:** tests 22, pass 22, fail 0
- **ran:** on a fresh copy of the 6.3.0 loop: import of research/2026-11-03-jarl-as-a-loop-tool/findings.json (--source its folder) and of the field report's materials/findings.json (--source its parent), dry and real, without --found-by and with the first run's (research, field-report) · **saw:** already filed 12 and already filed 38, no changed line on any run
- **ran:** on the same copy, dry runs with the first run's --found-by: every claim of both files rewritten, then only the claim of jarl-fr-1c239812 (issue 037) rewritten, then that one without --found-by · **saw:** loop-tool file: changed since filed 3 (031, 032, 089), the nine hand-filed 083 to 088, 090, 096, 098 silent; field report file: changed since filed 38; 037 alone: changed since filed 1, issue 037 (done) What with the issue text and the finding text; without --found-by field-report: no changed line
- **ran:** timeout -s INT 0.45 jarl import of 40 findings in a scratch loop, the import again, then 40 rewritten claims (dry run): with 7919973, then with the new code · **saw:** 7919973: the stop left 18 issues and no imported line, the re-run filed 22, changed since filed 22 (18 missed); new code: the stop left 16 issues and no imported line, the re-run filed 24, the unchanged file no changed line, changed since filed 40
- **ran:** two loop copies by the pinned driver (one imports T-1 as 001, the other files Print by hand --source ext/2026-11-05-tickets#T-2 --found-by 'research ext/2026-11-05-tickets' as 001), merged, the imported file given 002; import (dry run) of the unchanged file and of a changed T-1, with 7919973 and with the new code · **saw:** 7919973: changed since filed · T-2 · issue 001 (Our own words about printing.) on both runs, T-1 missed; new code: unchanged file no changed line, changed T-1: changed since filed · T-1 · issue 002
- **ran:** TMPDIR=<scratch> nice -n 15 timeout 2400 npm test in skills/jarl/scripts at the branch tip · **saw:** tests 1248, pass 1228, fail 0, cancelled 0, skipped 20; record-contract, skill-shape, tense and words green

Ruling import-reports-changes-for-claim-and-truth-findings: Krzysztof, 2026-11-05 (translated from Polish), after four review rounds of issue 044 and the finding that findings with neither a claim nor a truth (only evidence and a proposal) carry no mark in the issue file by which import could know the issue as its own: he chose 'say it plainly and leave it' (an option label, not his wording). Import reports a changed finding for the findings that carry a claim or a truth, compared with the issue import itself filed for them (recognised by the issue file: its Source is that finding alone, its Found by is what the run writes, its What opens with the claim or truth import writes). Findings with neither are not compared; the reference, the usage line, the import summary and the CHANGELOG say so in one sentence, with a test. No new record shape and no format raise are added for it.

