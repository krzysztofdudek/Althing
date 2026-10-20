# 292 · Althing: the merger brief records a red check whose cause is in the branch as a jarl round, not as a free-text note

**Status:** done
**Kind:** docs
**Priority:** 2
**Tier:** standard
**Tags:** althing, docs, briefs
**Files:** Althing/releases/6.2.0/briefs/merger.md
**Repo:** ../..
**Found by:** jarl-architect
**Where:** Althing/releases/6.2.0/briefs/merger.md, One merge, step 7; the retro of research/2026-10-11-jarl-model-calibration-and-field-notes (finding for Althing briefs)
**Branch:** jarl/288-briefs-checklist
**Merged:** 82a57c4 in ../..
**CI:** pending

## What
The merger brief records a red check after a merge as a free-text note, so the 6.2.0 record holds no round at all in 2,062 log lines and the metric red after approve cannot be counted for any model. A red whose cause is in the branch is a jarl round: it charges the worker, which is what calibration needs, and starts the fix cycle through the loop's own mechanism.

## Why
A note is invisible to every view and metric; a round is counted, shown by report, and prints the takeover block after the third.

## Acceptance
- merger.md step 7 says: a red check whose cause is in the branch is recorded with jarl round <id> naming what failed; a red whose cause is outside the branch stays a note until 246 lands
- A rail check or test proves the template carries that step; yg check and npm test green

## Evidence

- **ran:** node --test workspace/test/brief-templates.test.mjs · **saw:** before the text change: tests 7, pass 1, fail 6; the merger step-7 test fails with the free-text note still in step 7
- **ran:** node --test workspace/test/brief-templates.test.mjs · **saw:** after the text change, commit fdd8a8b: tests 7, pass 7, fail 0; the step-7 test passes
- **ran:** node --test "rails/test/*.test.mjs" "workspace/test/*.test.mjs" · **saw:** final run on the branch tip fdd8a8b: tests 97, pass 97, fail 0

