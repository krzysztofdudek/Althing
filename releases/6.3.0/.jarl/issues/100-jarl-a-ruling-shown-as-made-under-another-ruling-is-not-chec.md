# 100 · Jarl: a ruling shown as made under another ruling is not checked when the line was written by hand or an older Jarl, and the display does not mark it when the cited ruling is later superseded

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T1417-xyeu
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**After:** 063
**Found by:** rev-jarl-063-opus
**Where:** Review of 063 (2026-11-03): renderDecisions, lib/resume.mjs, cmdDecide
**Branch:** jarl/105-record-integrity
**Merged:** fc01fdfa7df54a60ede59eedf8b603f442b539f9 in ../../../JarlSkill
**CI:** none

## What
A ruling written by the pinned driver or by hand with a final Made under paragraph is shown as under <slug> without checking the slug; if the cited ruling is later superseded the display still shows under with no mark; --under accepts a ruling that is a rejected area ruling.

## Why
A mandate that no longer holds should show as such to the coordinator reading the ruling.

## Acceptance
The display marks a cited ruling that is not in force or does not exist, and --under refuses a cited ruling that is rejected, each with a test

## Evidence

- **ran (history):** cd skills/jarl/scripts && node --test tests/ruling-under.test.mjs (release tip with the new tests only) · **saw:** tests 10, pass 8, fail 2: decide --under area-rule is accepted on a rejected area ruling; decisions shows under standing-mandate with no mark after it is superseded
- **ran (history):** cd skills/jarl/scripts && node --test tests/ruling-under.test.mjs tests/scoped-rules.test.mjs tests/brief.test.mjs tests/resume.test.mjs tests/ratify-batch.test.mjs tests/record-contract.test.mjs tests/next-as.test.mjs (at b7a1341) · **saw:** ruling-under: tests 10, pass 10, fail 0; the related files all pass, record-contract included
- **ran (history):** a copy of the 6.3.0 loop: the driver writes a ruling ending in the paragraph Made under: no-such-ruling, then decisions with the release tip's jarl.mjs and b7a1341's · **saw:** release tip: under no-such-ruling; b7a1341: under no-such-ruling (not in force: no ruling of this loop)
- **ran (history):** cd skills/jarl/scripts && nice -n 15 timeout 1800 node tests/suite.mjs (at d6dd8ac) · **saw:** tests 1469, pass 1447, fail 0, cancelled 0, skipped 22; exit 0
- **ran (history):** cd skills/jarl/scripts && node tests/suite.mjs on the merged tip of the release branch, TMPDIR from mktemp -d · **saw:** tests 1469, pass 1447, fail 0, skipped 22, merge fc01fdf

