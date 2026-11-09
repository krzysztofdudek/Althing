# 068 · Jarl: the coordinator's own slips are not a statistic

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0838-waai
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-5d619ab6
**Where:** JarlSkill/skills/jarl/scripts/lib/resume.mjs (cmdReport), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:6022 at a1132a8
**After:** 035, 085
**Branch:** jarl/042-liveness-and-reopens
**Merged:** fa23bbd in ../../../JarlSkill
**CI:** none

## What
Claim: Closing too early or merging without the gate is invisible in report. Corrected by the sceptic: The proposal narrows to counting reopens after done, retractions and the closed-gate cases in report; refused writes are not in the record to count.

report counts reopenings; refused commands and reverted states are not counted. Map row fr-36.

## Why


## Acceptance
- report counts, per coordinator, the reopens after done and the retractions that coordinator wrote, read from the writer each move names (the --by per call of 085)
- Refused writes are not counted: a refusal writes nothing to the record
- Tests for both counts

## Changelog
- Added: The loop's report now counts, for each person who runs part of the loop, how many tasks they reopened after closing them and how many pieces of proof or approvals they took back, taken from the name each of those steps was recorded with.

## Evidence

Kept small by the model (report section 11): report per coordinator counts reopens after done and retractions; refused writes are not in the record and are not counted.
- **ran (history):** cd skills/jarl/scripts && nice -n 15 node --test tests/report-slips.test.mjs (the new test file on de8d74d, before the change) · **saw:** tests 3, pass 1, fail 2: report --json metrics.slips undefined (TypeError reading reopens); report --metrics printed no 'reopened after done, per writer' line; the refused-call test passed only because nothing was counted
- **ran (history):** cd skills/jarl/scripts && nice -n 15 node --test tests/report-slips.test.mjs tests/log-reader.test.mjs tests/report-metrics.test.mjs tests/retract.test.mjs (at 2ea7cb8) · **saw:** all pass: slips.reopens [odin 1 (1)], slips.retractions [jarl 1 (2), odin 1 (1), rev-a 1 (2) not a coordinator]; 'reopened after done, per writer: odin 1 (1)'; a refused set and two refused retracts write no log line and leave slips unchanged; an unnamed reopen counts as unnamed; a loop with neither says none

Correction to the first row above: the red run was on d9e9eea (the 042 commit) with the new test file added, not on de8d74d; de8d74d changes only the key order of status --json and does not touch report.
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 2400 npm test (at 2ea7cb8, the branch tip) · **saw:** tests 1193, pass 1173, fail 0, cancelled 0, skipped 20 (the release tip had 1181: the 12 new tests of liveness and report-slips)
- **ran (history):** npm test in skills/jarl/scripts of the release worktree, at fa23bbd with 042 and 068 merged into release/6.2.1 (TMPDIR a mktemp -d folder under the system temporary directory) · **saw:** tests 1193, pass 1173, fail 0, skipped 20, exit 0

