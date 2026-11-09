# 203 · Jarl: smaller gaps of the range and extend features found by the review of group L1

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261108T1233-xhkp
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** rev-jarl-043-opus-l1
**Where:** lib/import.mjs dry check; goal --set Range in a composer loop; the profile validator; lib/commands.mjs cmdExtend
**Branch:** jarl/203-range-extend-inplace
**Merged:** 0556c16208c09ce0faf295bce31a279416239fdb in ../../../JarlSkill
**CI:** none

## What
(1) The import dry check numbers findings first+k without stepping past declared ranges, so in a composer loop it files 998 and refuses the second finding while saying nothing was written. (2) goal --set Range is accepted in a composer loop where no range number can ever be filed. (3) The profile validator shared with profile <file> accepts a field named Title or Model, and a field and a section with the same name. (4) extend has no undo for a part it added. (5) After extend a loop with no profile reads as profile custom and status --json nests its counts under statuses, which is documented for profile loops but not where extend is described, and ws status reads the top-level counts. (6) extend writes its log line before the profile, so a failed profile write leaves a log line for nothing. (7) A range number filed in a clone with an older reader is possible until the first range number raises the loop.

## Why
The features should refuse what they cannot honour and say the same in every view.

## Acceptance
Each of the seven is fixed or said honestly in the docs or on the known-limitations list, with a test where the code changes

## Changelog
- Fixed: A new profile that declares a field named Title or Model, a field named like a part of a task's text or history (such as What, Evidence or Notes), or a field and a section with the same name, is now refused when you open a loop with it or check it, with the list of names a field cannot take. A loop you already run with such a field keeps it.

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/number-ranges.test.mjs tests/import-atomic.test.mjs tests/profile-extend.test.mjs, the test files of c61fb3c on the code of the release branch at b3104b1 · **saw:** red: tests 25, pass 22, fail 3 — in a composer loop holding 997 with Range (film): 999-1500 the import filed 998 and then refused finding-3 (1501 needs format 2), leaving the loop changed, the dry run alike passed its check on 999; goal --set Range was accepted in a composer loop; extend field Title was accepted
- **ran (history):** cd skills/jarl/scripts && node --test tests/number-ranges.test.mjs tests/import-atomic.test.mjs tests/profile-extend.test.mjs tests/profile.test.mjs tests/profile-keys.test.mjs tests/profile-sections.test.mjs tests/goal-lines.test.mjs tests/docs-true.test.mjs tests/tense.test.mjs tests/vocabulary.test.mjs tests/words.test.mjs tests/skill-shape.test.mjs tests/printed-texts.test.mjs tests/modules.test.mjs tests/record-contract.test.mjs tests/version.test.mjs, at c61fb3c · **saw:** green: tests 163, pass 163, fail 0 — (1) the import and its dry run refuse finding-3 at 1501 before anything is written, with the --only way out, and --only finding-2 files 998; (2) goal --set Range in a composer loop is refused (a number from a range needs record format 3 ... nothing was written), ending with jarl.mjs profile and jarl.mjs goal --set "<machine-line>"; (3) extend field Title, model and Notes are refused naming every name a field may not take, extend field risks and extend section AREA are refused as a field and a section of one name, and profile <file> refuses a field Title and a field Plan beside a section plan
- **ran (history):** read of the acceptance of 203 and cmdExtend, for point 4 (no undo of extend) · **saw:** the acceptance asks each point fixed or said honestly; no remove command is asked for, so the smaller honest change is taken: references/commands.md says extend only adds, and a part it added is changed or taken out by editing .jarl/profile.json by hand, which every command then checks
- **ran (history):** point 5: status and status --json on a scratch loop with no profile, before and after extend section Risks, at c61fb3c; and a read of workspace/ws.mjs in Althing · **saw:** after extend the opened line says profile custom and status --json keeps the counts under statuses (open 1, in-progress 0, ...); now said in the extend row of references/commands.md; ws status reads s.open and the other top-level counts only, so on a loop extended this way it would print undefined (left to the coordinator, Althing is not changed here)
- **ran (history):** point 6: cmdExtend in lib/commands.mjs and tests/profile-extend.test.mjs at b3104b1 · **saw:** already fixed: the profile is written before its log line, and the test 'a profile that cannot be written leaves no log line, with --by and without' passes; only the comment above cmdExtend still said the log line came first, corrected
- **ran (history):** point 7: references/record.md, the format marker · **saw:** one sentence added after the table of format 3: a Range line raises nothing by itself, so until the first number of a range is filed a reader of formats 1 and 2 numbers as it always has and may take a number of a range that starts right above the highest number filed
- **ran (history):** every read view (status, resume, report, report --metrics, list, list --all, next, next --all, next --as jarl and owner, verify, decisions, decisions --live, models, branches, goal, profile, sources; show, show --json and brief of each of the 205 issues; show --full and the reviewer's brief of the last 20), text and --json, base b3104b1 against cb00e5e on a copy of the 6.3.0 loop with its repositories linked, ages masked · **saw:** 686 views, each run with both: 1 differs, report --json, whose 205 issue rows each gain parent: null (no issue of the loop has a parent), as list and show already give it; closedGate is 028 alone in both; the copy is unchanged by the views
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs, at 2b7c932 (release/6.2.1 at f3d0963 merged), TMPDIR from mktemp -d; then node --test tests/queue-views.test.mjs at efcdc93 · **saw:** tests 1686, pass 1663, fail 1, skipped 22 (the record contract test included): the one failure was tests/queue-views.test.mjs, whose exact report row lacked the parent key report --json now carries; the row is expected with parent: null at efcdc93, and that file passes, tests 7, pass 7, fail 0
- **ran (history):** merged jarl/203-range-extend-inplace into release/6.2.1 (one conflict in references/commands.md, status row of 195 and report row of 158 kept); suite on the merge in skills/jarl/scripts · **saw:** see the suite row of the merge
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merge 0556c16208c09ce0faf295bce31a279416239fdb of jarl/203-range-extend-inplace into release/6.2.1 · **saw:** 1699 tests, 1677 pass, 0 fail, 22 skipped

