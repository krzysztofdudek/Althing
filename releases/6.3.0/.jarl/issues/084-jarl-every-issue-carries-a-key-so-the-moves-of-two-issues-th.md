# 084 · Jarl: every issue carries a key, so the moves of two issues that took one number never mix, and a number taken twice is renumbered at the merge

**Status:** done
**Kind:** gap
**Priority:** 1
**Tier:** strong
**Tags:** design, format
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** research
**Source:** research/2026-11-03-jarl-as-a-loop-tool#model-issue-key
**Where:**
**After:** 035, 031, 083, 085
**Branch:** jarl/084-issue-keys
**Merged:** e100b8b in ../../../JarlSkill
**CI:** none

## What
Ruling two-machines-caught-at-merge and report section 8: a log line names its issue by number only (scripts/lib/log.mjs:37-38) and numbering reads this checkout and its worktrees only, so two clones or two branches of one checkout give two issues one number and mix their moves beyond repair (031 detects and refuses; this makes it repairable).

## Why
Several sessions and machines on one loop is the shape Jarl is meant for; the record must never mix two issues.

## Acceptance
- new writes a key (the filing stamp and a few random characters) into the header and the filed line, and every log line about the issue carries it; unkeyed lines of older loops read by number as today
- Numbers are taken over every local and remote-tracking ref of the clone, not only this checkout and its worktrees
- After a merge that brings two issues with one number, renumber gives one of them a free number; the keys tell their moves apart and no history line is rewritten
- Lease lines name their writer (the --by per call of 085); two leases with no move out between them, by different writers and with no takeover, show on the jarl's list (next --as jarl, 052) as a conflict; verify refuses an issue file that holds git conflict markers
- Tests for two clones and for two branches of one checkout; red at 71ebc5b on two issues numbered 2 and verify clean

## Changelog
- Fixed: Two copies of one loop, such as two clones or two branches, no longer mix up two tasks that got the same number. Each task gets its own key when it is filed, a new task skips the numbers any branch of your clone already uses, and after a merge one command gives one of the two tasks a new number with all its history kept. Two people taking the same task in two copies show up on the jarl's list, and the record check stops at a task file left half-merged by git.

## Evidence

- **ran:** node --test tests/issue-keys.test.mjs tests/two-copies.test.mjs, the new tests on release/6.2.1 at 4f741c3 before the change (a copy from git archive, TMPDIR under ~/Temp/tmp) · **saw:** 13 tests, 2 pass, 11 fail: no key in header or filed line, no raise to 3, a fetched clone and a second branch take number 2 again, renumber unknown, no lease conflict row, verify clean on a file with git conflict markers; the two passing are guards (a composer's loop gets no key, no false lease conflict)
- **ran:** node --test tests/issue-keys.test.mjs tests/two-copies.test.mjs on jarl/084-issue-keys at 29e9a80, then nice -n 15 timeout 1800 npm test in skills/jarl/scripts (TMPDIR under ~/Temp/tmp) · **saw:** 13 of 13 pass (two clones and two branches of one checkout: keys apart, renumber 2 --key gives 3 with the log only appended to, verify clean after; lease conflict row; conflict markers refused); full suite 1078 tests, 1055 pass, 0 fail, 23 skipped
- **ran:** on a copy of releases/6.3.0/.jarl: this branch's verify, status, then new --by w-jarl-084-opus and evidence 115; then the pinned driver's status on the same copy · **saw:** before: record format 1, verify finds nothing of the format; new filed 115 with **Key:** 20261104T0715-vcle, the filed and the evidence lines carry key 20261104T0715-vcle, verify 'record format 3: clean'; the driver refuses: 'is written for record format 3, and this Jarl reads format 1 - use the Jarl the loop was opened with ..., or upgrade this one'
- **ran:** node --test tests/two-copies.test.mjs at 71ebc5b (a copy from git archive, the branch's test file copied in, TMPDIR under ~/Temp/tmp) · **saw:** 7 tests, 0 pass, 7 fail: a fetched clone and a second branch of one checkout each take number 2 again ('2' !== '3'), set has no --by (no writer, so no lease conflict), renumber unknown, verify says 'verify: clean' on an issue file holding git conflict markers
- **ran:** nice -n 15 timeout 1800 npm test in skills/jarl/scripts on jarl/084-issue-keys at 5660547, release/6.2.1 at 5ce62f0 merged in (TMPDIR under ~/Temp/tmp) · **saw:** 1088 tests, 1065 pass, 0 fail, 23 skipped
- **ran:** node --test tests/two-copies.test.mjs tests/issue-keys.test.mjs at bd5e8e9 (release/6.2.1 at 9f971b6 merged, before the round-2 fixes; a copy from git archive with the round-2 test files, TMPDIR under ~/Temp/tmp) · **saw:** 17 tests, 12 pass, 5 fail: a profile file with a field Key is refused by the old message, a loop already open with a Key field is refused, running to landed under the house profile and a second writer setting the same lease show as a conflict, verify refuses a fenced quote of a git conflict
- **ran:** the same two files on jarl/084-issue-keys with the round-2 fixes, then nice -n 15 timeout 1800 npm test in skills/jarl/scripts (TMPDIR under ~/Temp/tmp) · **saw:** 17 of 17 pass; full suite 1108 tests, 1085 pass, 0 fail, 23 skipped
- **ran:** node --test tests/two-copies.test.mjs at f89c1e0 (a copy from git archive with the round-3 test file, TMPDIR under ~/Temp/tmp) · **saw:** 12 tests, 11 pass, 1 fail: a real git conflict whose side holds a fenced block reads 'verify: clean'
- **ran:** node --test tests/two-copies.test.mjs tests/shared-number.test.mjs on jarl/084-issue-keys with the round-3 fix, then nice -n 15 timeout 1800 npm test in skills/jarl/scripts (TMPDIR under ~/Temp/tmp) · **saw:** 31 of 31 pass (the fenced real conflict refused, a quoted conflict in a fence and a lone opening marker clean); full suite 1110 tests, 1087 pass, 0 fail, 23 skipped
- **ran:** node --test tests/two-copies.test.mjs at 704ca47 with the round-4 test file (TMPDIR under ~/Temp/tmp) · **saw:** 14 tests, 10 pass, 4 fail: a conflict quoted through new, body, a note and a reason is written with its markers at column 0; a real conflict inside a fence both sides share reads 'verify: clean'; a lone opening marker hides the later conflict (named at line 14, not 21); CRLF text quoting a conflict is not escaped
- **ran:** node --test tests/two-copies.test.mjs on jarl/084-issue-keys at db054f8, then nice -n 15 timeout 1800 npm test in skills/jarl/scripts (TMPDIR under ~/Temp/tmp) · **saw:** 14 of 14 pass; full suite 1112 tests, 1089 pass, 0 fail, 23 skipped
- **ran:** on a copy of releases/6.3.0/.jarl: verify of 704ca47 and of db054f8, then body 117 --why and evidence 117 quoting a conflict, show 117 and verify · **saw:** both verify runs: 7 findings, issues/: clean (6 undated log lines and one superseded ruling, the same before and after); show 117 prints \<<<<<<< HEAD, \=======, \>>>>>>> main; verify again: issues/: clean
- **ran:** node --test tests/two-copies.test.mjs at db054f8 with the round-5 test file (TMPDIR under ~/Temp/tmp) · **saw:** 18 tests, 15 pass, 3 fail: a real pull whose conflict holds an opening marker after the separator, and one whose conflict holds a closing marker before it, each read 'verify: clean'; the refusal says nothing of quoted markers
- **ran:** node --test tests/two-copies.test.mjs on jarl/084-issue-keys at b00889d, then nice -n 15 timeout 1800 npm test in skills/jarl/scripts (TMPDIR under ~/Temp/tmp) · **saw:** 18 of 18 pass (both stray-marker pulls refused, markers in another order clean, a lone opening marker clean and a conflict after it refused); full suite 1116 tests, 1093 pass, 0 fail, 23 skipped
- **ran:** npm test (in skills/jarl/scripts of the release worktree, at e100b8b with 084 merged, TMPDIR under ~/Temp/tmp) · **saw:** 1116 tests, 1093 pass, 0 fail, 23 skipped

