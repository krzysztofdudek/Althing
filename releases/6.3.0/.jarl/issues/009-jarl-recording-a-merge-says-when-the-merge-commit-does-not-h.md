# 009 · Jarl: recording a merge says when the merge commit does not hold both the branch and its base

**Status:** done
**Kind:** gap
**Priority:** 2
**Tier:** standard
**Tags:** 
**Files:** 
**Repo:** ../../../JarlSkill
**Found by:** field-report
**Where:**
**Branch:** jarl/009-merge-holds-branch-and-base
**Merged:** 2f4494b in ../../../JarlSkill
**CI:** none

## What
A merger checked a branch whose base had moved on, merged it, and left the base red. The merger reference already says to merge first and check the result, but merged takes any commit and does not look at what it contains.

## Why
A loud note at the moment of recording is the cheapest place to catch a check that ran on the wrong tree.

## Acceptance
- merged --sha notes, loudly, when the recorded commit does not contain the branch tip or does not contain the base as it stands
- The merger reference says once that the check runs on the merge result and that this note means it did not
- Tests for a merge without the base, without the branch, and for the normal case

## Changelog
- Fixed: Recording a merge now warns when the commit you give does not contain the branch's latest work or the latest state of the branch it is merged into, so a check that ran on the wrong version is noticed at once.

## Evidence

Ruling everything-from-the-field-report-into-6-2-1: Every finding of the field report from a long loop ships in Jarl 6.2.1, bugs and gaps alike (the owner, 2026-10-22, translated: everything into 6.2.1). The patch moves Jarl alone; its manifest names Jarl only.
- **ran:** node --test tests/merge-holds.test.mjs, lib change removed · **saw:** pass 3, fail 2: the base and the branch notes are missing
- **ran:** node --test tests/merge-holds.test.mjs · **saw:** pass 5, fail 0
- **ran:** TMPDIR under ~/Temp/tmp, cd skills/jarl/scripts && nice -n 15 timeout 1800 npm test · **saw:** tests 832, pass 809, fail 0, skipped 23 (merge 2f4494b on release/6.2.1)

