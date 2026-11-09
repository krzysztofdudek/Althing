# 046 · Jarl: merged without --sha does not offer the branch head

**Status:** done
**Kind:** gap
**Priority:** 3
**Tier:** standard
**Key:** 20261103T0838-wtec
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Source:** research/2026-11-03-jarl-field-report-long-loop#jarl-fr-6f9ea020
**Where:** JarlSkill/skills/jarl/scripts/lib/commands.mjs (cmdMerged), at release/6.2.1 71ebc5b after the split; jarl-lib.mjs:2110 at a1132a8
**Branch:** jarl/046-refusal-texts
**Merged:** 79805b6 in ../../../JarlSkill
**CI:** none

## What
Claim: merged without --sha was refused and the line had to be retyped.

The refusal is immediate and names --sha but gives no ready command. Map row fr-11.

## Why


## Acceptance
- merged without --sha is refused with the ready command written out, carrying the tip of the branch the issue's lease records; with no branch recorded it says so; a merge is never recorded without --sha
- Tests for both cases; red on 71ebc5b

## Changelog
- Fixed: When a merge is recorded without its commit, Jarl now shows the latest commit of the issue's branch and the exact command that records it, so you do not have to look the commit up and retype the command.

## Evidence

- **ran (history):** node --test tests/merge-holds.test.mjs (on commit 71ebc5b-based branch before the change, the two new tests added) · **saw:** ℹ tests 9 / ℹ pass 7 / ℹ fail 2: merged without --sha is refused with the ready command carrying the head of the branch the lease records, and the no-branch test, both AssertionError: the refusal reads '1 records no merge yet — give --sha: jarl.mjs merged 1 --sha <sha> --ci green'
- **ran (history):** TMPDIR=~/Temp/tmp/w046 nice -n 15 timeout 600 node --test tests/merge-holds.test.mjs · **saw:** ℹ tests 9, ℹ pass 9, ℹ fail 0; the two new merged tests pass after the change
- **ran (history):** TMPDIR=~/Temp/tmp/w046 nice -n 15 timeout 1800 npm test (in skills/jarl/scripts, on the branch tip 0be663a) · **saw:** ℹ tests 849, ℹ pass 826, ℹ fail 0, ℹ skipped 23
- **ran (history):** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 856, pass 833, fail 0, skipped 23 (merge 79805b6 on release/6.2.1)

