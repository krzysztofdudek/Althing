# 195 · Grain: on jsoup lex-indent says '2 break it today', while yg check --full reports 9 violations in 9 files; two enforced rules with existing violations

**Status:** done
**Kind:** bug
**Priority:** 2
**Tier:** strong
**Key:** 20261002T1640-qxik
**Tags:** grain, propose
**Files:** Grain/plugins/grain/engine/propose-aspects.mjs
**Repo:** ../../../Grain
**After:** 043
**Found by:** grain-157
**Where:**
**Branch:** jarl/195-propose-truth
**Merged:** c85cdc9
**CI:** none

## What
After 043 and 110 the number of violations of the indentation rule in the proposal (2) does not match what yg check --full reports (9 in 9 files) on jsoup 088614f4; two enforced rules have existing violations.

## Why
The 'N break it today' number is meant to match what yg check will show (the goal of the 6.1.1 patch, R1).

## Acceptance
On jsoup the number from propose matches yg check --full for every enforced rule; test.

## Changelog
- Fixed: grain propose's "N break it today" for an indentation or file-name rule now counts the files yg check --full refuses, not grain's own reading of each file.

## Evidence

docs: docs/reference.md (propose, enforced rules): an enforced rule's 'N break it today' / existingViolations counts the files the rule's own check refuses in the work tree where grain can run that check (lexical and file-name rules), else grain's measured deviants

jsoup 088614f4, YG_BIN frozen 6.1.0: before, lex-indent 'holds for 194 of 196; 2 break it today' (yg adopt --dry-run 2) vs yg check --full 'partition-lex-indent — 9 violations'; after, 'holds for 187 of 196; 9 break it today', dry-run 9; filenameshape 9 = 9 unchanged; statuses and drills unchanged. Test tests/propose-count-is-yg-check.test.mjs red {lex-indent: 1} vs {3}, green.

full gate on 6c96eaf with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES: tests 2235, pass 2234, fail 0, skipped 1
- **ran (history):** npm test with YG_BIN, HORDE_DIR, GRAIN_CORPUS_CLONES (release/6.1.1) · **saw:** tests 2245, pass 2244, fail 0, skipped 1, merge c85cdc9

