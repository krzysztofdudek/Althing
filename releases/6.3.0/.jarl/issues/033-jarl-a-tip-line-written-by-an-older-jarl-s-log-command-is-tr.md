# 033 · Jarl: a tip line written by an older Jarl's log command is trusted, record.mjs's comment omits tip lines, and a closed issue can show its gate as broken after its branch moves

**Status:** done
**Kind:** bug
**Priority:** 3
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 002
**Found by:** rev-jarl-002-opus
**Where:** Review of 002 (2026-11-03)
**Branch:** jarl/105-record-integrity
**Merged:** fc01fdfa7df54a60ede59eedf8b603f442b539f9 in ../../../JarlSkill
**CI:** none

## What
The pinned 6.1.0 driver's log command and Horde's vendored 6.1.0 record.appendLog still write a line of the shape '<id> tip <sha>', and this Jarl trusts it as the tip of a row. The comment above appendLog in record.mjs does not list tip lines among the lines it refuses. The views read the branch's tip each time, so a closed issue whose branch later moves, or is deleted with no tip recorded on its merge, shows its gate as not holding.

## Why
A forged tip line can keep proof alive across a pause; a false red on a closed issue misleads a coordinator.

## Acceptance
- A tip line counts only when the Jarl that wrote it is one that writes tip lines (a marker the older reader cannot produce), with a test that writes one through an older-shaped log line and sees it ignored
- record.mjs's comment lists tip lines, and a done issue's gate is judged against the tip recorded when it closed, with a test

## Evidence

jarl-lib.mjs was split into skills/jarl/scripts/lib/ at merge 71ebc5b (issue 030); any file:line in this issue that names jarl-lib.mjs now lives in one of the lib/ modules
- **ran:** cd skills/jarl/scripts && node --test --test-name-pattern="keeps nothing across a pause|judged against the tip" tests/gate-window.test.mjs (release tip with the new tests only) · **saw:** pass 0, fail 2: a tip line written a minute after the approve kept it across a pause ([0, true]); status --json closedGate flagged 001 after a commit on its branch past the close
- **ran:** cd skills/jarl/scripts && node --test tests/gate-window.test.mjs tests/record-contract.test.mjs tests/closed-gate.test.mjs tests/merge-check.test.mjs tests/log-reader.test.mjs tests/seams.test.mjs tests/docs-true.test.mjs (at 05674f2) · **saw:** gate-window: tests 16, pass 15, fail 0, 1 skipped (needs JARL_LIVE_LOOP); the related files all pass, record-contract included
- **ran:** status --json on a copy of the 6.3.0 loop, the release tip's jarl.mjs against 05674f2's · **saw:** identical but for the ageMs fields: the loop holds no tip line, so no gate changes
- **ran:** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at d6dd8ac) · **saw:** tests 1469, pass 1447, fail 0, cancelled 0, skipped 22; exit 0
- **ran:** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1469, pass 1447, fail 0, skipped 22, merge fc01fdf

Ruling ask-018 (ratify): reject: Krzysztof chose, instead of the known limitation, to raise the format with a tip mark before the separator, so the tip line of an older log command no longer counts (an option label, not his wording).

